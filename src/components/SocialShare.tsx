'use client';

import { Button } from '@/components/ui/button';
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  variant?: 'inline' | 'floating';
}

export function SocialShare({
  url,
  title = 'Check out C2 ConcreteBlock Pro',
  description = 'Quality concrete blocks in Guyana',
  variant = 'inline',
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-blue-700',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-green-600',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'hover:bg-gray-600',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (variant === 'floating') {
    return (
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all ${link.color} hover:text-white`}
            title={`Share on ${link.name}`}
          >
            <link.icon className="h-5 w-5" />
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          className={`w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all hover:bg-[#1E3A5F] hover:text-white`}
          title="Copy link"
        >
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 mr-2">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-all ${link.color} hover:text-white`}
          title={`Share on ${link.name}`}
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-all hover:bg-[#1E3A5F] hover:text-white`}
        title="Copy link"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

// Floating social share button (mobile-friendly)
export function FloatingShareButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 left-4 z-40 lg:hidden">
      {isOpen && (
        <div className="absolute bottom-14 left-0 bg-white rounded-lg shadow-xl p-2 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
          <SocialShare variant="inline" />
        </div>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-[#1E3A5F] hover:bg-[#152d4a]"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </Button>
    </div>
  );
}
