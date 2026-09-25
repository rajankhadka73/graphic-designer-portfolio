import React from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  body?: string;
  className?: string;
}

export default function SectionHeader({ eyebrow, title, body, className = '' }: SectionHeaderProps) {
  return (
    <div className={className}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {body && <p className="section-body">{body}</p>}
    </div>
  );
}
