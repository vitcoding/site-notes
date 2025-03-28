import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MarkdownEditor from '../components/MarkdownEditor';

const CreateEditArticle = () => {
    const { articleId } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState({
        title: '',
        content: '',
        author: '',
        is_markdown: true
    });

    useEffect(() => {
        if (articleId) {
            fetch(`http://localhost:8000/articles/${articleId}`)
                .then(response => response.json())
                .then(data => setArticle(data));
        }
    }, [articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const url = articleId 
            ? `http://localhost:8000/articles/${articleId}`
            : 'http://localhost:8000/articles/';
            
        const method = articleId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(article),
        });

        if (response.ok) {
            navigate('/articles');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticle(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content) => {
        setArticle(prev => ({ ...prev, content }));
    };

    return (
        <div className="container">
            <h1>{articleId ? 'Edit Article' : 'Create New Article'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={article.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Content (Markdown)</label>
                    <MarkdownEditor 
                        value={article.content} 
                        onChange={handleContentChange} 
                    />
                </div>
                <div className="form-group">
                    <label>Author</label>
                    <input
                        type="text"
                        name="author"
                        value={article.author}
                        onChange={handleChange}
                        required
                    />
                </div>
                <input 
                    type="hidden" 
                    name="is_markdown" 
                    value={article.is_markdown} 
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default CreateEditArticle;