import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownEditor = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState('write');

  return (
    <div className="markdown-editor">
      <div className="tabs">
        <button
          className={activeTab === 'write' ? 'active' : ''}
          onClick={() => setActiveTab('write')}
        >
          Write
        </button>
        <button
          className={activeTab === 'preview' ? 'active' : ''}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      {activeTab === 'write' ? (
        <textarea
          className="editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your Markdown here..."
        />
      ) : (
        <div className="markdown-preview">
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
            {value}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;