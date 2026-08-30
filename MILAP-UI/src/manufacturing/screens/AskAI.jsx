import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { IconUpload, IconTrash } from '../../components/icons.jsx';

function iconForFile(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (ext === 'pdf') return '📄';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return '🖼️';
  return '📁';
}

export default function AskAI() {
  const { chatMessages, askAI, documents, uploadDocuments, deleteDocument, formatBytes } = useApp();
  const [input, setInput] = useState('');
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  const submit = (q) => {
    askAI(q);
    setInput('');
  };

  const onFilesChosen = (e) => {
    uploadDocuments(e.target.files);
    e.target.value = '';
  };

  return (
    <section id="askai" className="screen active">
      <div className="hero"><div><h1>Ask AI</h1><div className="sub">Natural-language access to quotations, orders, service data and your connected knowledge documents.</div></div></div>
      <div className="grid two">
        <div className="card">
          <div id="chat" ref={chatRef} className="chat">
            {chatMessages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>{m.text}</div>
            ))}
          </div>
          <div className="flex">
            <input
              className="input"
              style={{ flex: 1 }}
              placeholder="e.g. Which quotations have not been followed up for 7 days?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(input); }}
            />
            <button className="btn" onClick={() => submit(input)}>Ask</button>
          </div>
          <div className="flex" style={{ marginTop: 10 }}>
            <button className="btn small secondary" onClick={() => submit('Which quotations have not been followed up for 7 days?')}>Stale quotations</button>
            <button className="btn small secondary" onClick={() => submit('Which orders are at risk of delay?')}>Orders at risk</button>
            <button className="btn small secondary" onClick={() => submit('How many service tickets are open?')}>Open service</button>
            <button className="btn small secondary" onClick={() => submit('What documents are connected?')}>Documents</button>
          </div>
        </div>

        <div className="card">
          <h2>Knowledge Documents</h2>
          <div className="sub">Upload manuals, catalogues, SOPs or price lists so Ask AI can reference them in its answers.</div>

          <div className="doc-list">
            {documents.length === 0 && (
              <div className="callout">No documents yet. Upload one below to get started.</div>
            )}
            {documents.map((doc) => (
              <div className="doc-row" key={doc.id}>
                <div className="doc-row-icon">{iconForFile(doc.name)}</div>
                <div className="doc-row-copy">
                  <b>{doc.name}</b>
                  <span>{formatBytes(doc.sizeBytes)}</span>
                </div>
                <button
                  className="icon-btn"
                  title={`Remove ${doc.name}`}
                  aria-label={`Remove ${doc.name}`}
                  onClick={() => deleteDocument(doc.id)}
                >
                  <IconTrash />
                </button>
              </div>
            ))}
          </div>

          <label className="upload-btn">
            <IconUpload />
            Upload Document
            <input ref={fileInputRef} type="file" multiple onChange={onFilesChosen} />
          </label>
        </div>
      </div>
    </section>
  );
}
