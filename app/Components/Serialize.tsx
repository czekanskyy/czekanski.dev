import React, { Fragment } from 'react';
import escapeHTML from 'escape-html';
import { Text } from 'slate';

type Node = {
  type: string;
  value?: {
    url: string;
    alt: string;
  };
  children?: Node[];
  url?: string;
  [key: string]: any;
};

export const Serialize = ({ children }: { children?: Node[] | null }) => (
  <Fragment>
    {children?.map((node, i) => {
      if (Text.isText(node)) {
        let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />;

        if (node.bold) {
          text = <strong key={i}>{text}</strong>;
        }

        if (node.code) {
          text = <code key={i}>{text}</code>;
        }

        if (node.italic) {
          text = <em key={i}>{text}</em>;
        }

        if (node.underline) {
          text = (
            <span style={{ textDecoration: 'underline' }} key={i}>
              {text}
            </span>
          );
        }

        if (node.strikethrough) {
          text = (
            <span style={{ textDecoration: 'line-through' }} key={i}>
              {text}
            </span>
          );
        }

        return <Fragment key={i}>{text}</Fragment>;
      }

      if (!node) {
        return null;
      }

      switch (node.type) {
        case 'h1':
          return (
            <h1 key={i} className="text-4xl font-bold mb-4">
              <Serialize children={node.children} />
            </h1>
          );
        case 'h2':
          return (
            <h2 key={i} className="text-3xl font-bold mb-3">
              <Serialize children={node.children} />
            </h2>
          );
        case 'h3':
          return (
            <h3 key={i} className="text-2xl font-bold mb-2">
              <Serialize children={node.children} />
            </h3>
          );
        case 'h4':
          return (
            <h4 key={i} className="text-xl font-bold mb-2">
              <Serialize children={node.children} />
            </h4>
          );
        case 'h5':
          return (
            <h5 key={i} className="text-lg font-bold mb-1">
              <Serialize children={node.children} />
            </h5>
          );
        case 'h6':
          return (
            <h6 key={i} className="text-base font-bold mb-1">
              <Serialize children={node.children} />
            </h6>
          );
        case 'quote':
          return (
            <blockquote key={i} className="border-l-4 border-neutral-500 pl-4 italic">
              <Serialize children={node.children} />
            </blockquote>
          );
        case 'ul':
          return (
            <ul key={i} className="list-disc list-inside mb-4">
              <Serialize children={node.children} />
            </ul>
          );
        case 'ol':
          return (
            <ol key={i} className="list-decimal list-inside mb-4">
              <Serialize children={node.children} />
            </ol>
          );
        case 'li':
          return (
            <li key={i}>
              <Serialize children={node.children} />
            </li>
          );
        case 'link':
          return (
            <a
              href={escapeHTML(node.url)}
              key={i}
              className="text-blue-400 hover:underline"
              target={node.newTab ? '_blank' : undefined}
              rel={node.newTab ? 'noopener noreferrer' : undefined}
            >
              <Serialize children={node.children} />
            </a>
          );

        default:
          return (
            <p key={i} className="mb-4">
              <Serialize children={node.children} />
            </p>
          );
      }
    })}
  </Fragment>
);
