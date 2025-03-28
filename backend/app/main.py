from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .database import SessionLocal, engine
from .models import Article, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ArticleSchema(BaseModel):
    id: int
    title: str
    content: str
    author: str

    class Config:
        orm_mode = True


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Articles API"}


@app.get("/articles/", response_model=List[ArticleSchema], tags=["Articles"])
async def read_articles():
    db = SessionLocal()
    articles = db.query(Article).all()
    db.close()
    return articles


@app.get(
    "/articles/{article_id}", response_model=ArticleSchema, tags=["Articles"]
)
async def read_article(article_id: int):
    db = SessionLocal()
    article = db.query(Article).filter(Article.id == article_id).first()
    db.close()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


# Initialize with some sample data
@app.on_event("startup")
async def startup():
    db = SessionLocal()
    if db.query(Article).count() == 0:
        sample_articles = [
            Article(
                title="FastAPI Introduction",
                content="FastAPI is a modern, fast web framework...",
                author="John Doe",
            ),
            Article(
                title="React Basics",
                content=(
                    "React is a JavaScript library for building "
                    "user interfaces..."
                ),
                author="Jane Smith",
            ),
            Article(
                title="Docker for Developers",
                content=(
                    "Docker simplifies the process of managing "
                    "application processes..."
                ),
                author="Mike Johnson",
            ),
        ]
        db.add_all(sample_articles)
        db.commit()
    db.close()


class ArticleCreate(BaseModel):
    title: str
    content: str
    author: str


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None


@app.post("/articles/", response_model=ArticleSchema, tags=["Articles"])
async def create_article(article: ArticleCreate):
    db = SessionLocal()
    db_article = Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    db.close()
    return db_article


@app.put(
    "/articles/{article_id}", response_model=ArticleSchema, tags=["Articles"]
)
async def update_article(article_id: int, article: ArticleUpdate):
    db = SessionLocal()
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    update_data = article.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_article, key, value)

    db.commit()
    db.refresh(db_article)
    db.close()
    return db_article


@app.delete("/articles/{article_id}", tags=["Articles"])
async def delete_article(article_id: int):
    db = SessionLocal()
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    db.delete(db_article)
    db.commit()
    db.close()
    return {"message": "Article deleted successfully"}
