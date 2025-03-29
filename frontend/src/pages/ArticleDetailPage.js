import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
            
            {article.is_markdown ? (
                <div className="markdown-content">
                    <ReactMarkdown
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={tomorrow}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </div>
            ) : (
                <p>{article.content}</p>
            )}
        </div>
    );
};

export default ArticleDetailPage;