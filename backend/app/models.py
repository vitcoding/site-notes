from sqlalchemy import Boolean, Column, Integer, String

from .database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    author = Column(String)
    is_markdown = Column(Boolean, default=True)
