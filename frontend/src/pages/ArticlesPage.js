import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/articles/')
            .then(response => response.json())
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1>Articles</h1>
            <ul>
                {articles.map(article => (
                    <li key={article.id}>
                        <Link to={`/articles/${article.id}`}>
                            <h2>{article.title}</h2>
                            <p>By {article.author}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticlesPage;