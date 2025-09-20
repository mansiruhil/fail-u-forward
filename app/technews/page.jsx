"use client";

import React, { useEffect, useState } from "react";
import Sentiment from "sentiment";
import { RefreshButton } from "@/components/ui/refresh-button";

const SadRejectionNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRefresh = async () => {
    // Force a page refresh to reload all data
    window.location.reload();
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news?q=rejection');
        const data = await response.json();

        if (data.articles) {
          const sentiment = new Sentiment();
          const sadNews = data.articles.filter((article) => {
            const analysis = sentiment.analyze(article.title + " " + article.description);
            return analysis.score < 0; // Filter negative sentiment articles
          });

          setNews(sadNews);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sad Rejection News</h1>
        <RefreshButton onRefresh={handleRefresh} size="sm" />
      </div>
      {news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-100 flex flex-col"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <h2 className="text-lg font-semibold text-gray-800">{article.title}</h2>
              </a>
              <p className="text-sm text-gray-600 mt-2 flex-grow">
                {article.description ? article.description : "No description available."}
              </p>
              <small className="text-xs text-gray-500 mt-4">
                Published by {article.source.name} on{" "}
                {new Date(article.publishedAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No sad rejection news found</p>
      )}
    </div>
  );
};

export default SadRejectionNews;
