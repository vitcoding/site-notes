import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/articles/')
            .then(response => response.json())
            .then(data => {
                setArticles(data);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            await fetch(`http://localhost:8000/articles/${id}`, {
                method: 'DELETE'
            });
            setArticles(articles.filter(article => article.id !== id));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1>Articles</h1>
            <button onClick={() => navigate('/articles/new')}>Create New</button>
            <ul className="articles-list">
                {articles.map(article => (
                    <li key={article.id} className="article-item">
                        <Link to={`/articles/${article.id}`}>
                            <h2>{article.title}</h2>
                            <p>By {article.author}</p>
                        </Link>
                        <div className="article-actions">
                            <button onClick={() => navigate(`/articles/edit/${article.id}`)}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(article.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticlesPage;