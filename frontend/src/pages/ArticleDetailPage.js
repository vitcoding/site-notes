import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ArticleDetailPage = () => {
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8000/articles/${articleId}`)
            .then(response => {
                if (!response.ok) throw new Error('Article not found');
                return response.json();
            })
            .then(data => {
                setArticle(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching article:', error);
                setLoading(false);
            });
    }, [articleId]);

    if (loading) return <div>Loading...</div>;
    if (!article) return <div>Article not found</div>;

    return (
        <div className="container">
            <h1>{article.title}</h1>
            <h3>By {article.author}</h3>
            <p>{article.content}</p>
        </div>
    );
};

export default ArticleDetailPage;