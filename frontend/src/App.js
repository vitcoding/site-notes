import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/articles">Articles</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/articles" element={<ArticlesPage />} />
                <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
            </Routes>
        </Router>
    );
}

export default App;