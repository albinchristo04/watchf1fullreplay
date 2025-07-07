import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="bg-f1-light-dark p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-black mb-6 uppercase tracking-wider text-white">
          About <span className="text-f1-red">f1fullreplay.com</span>
        </h1>
        <div className="prose prose-lg max-w-none mt-6">
          <p>
            Welcome to f1fullreplay.com, the ultimate destination for Formula 1 enthusiasts. Our passion for the pinnacle of motorsport drove us to create a dedicated space where fans can relive the excitement of every Grand Prix.
          </p>
          <p>
            Our mission is simple: to provide a clean, user-friendly, and comprehensive archive of F1 race replays. Whether you missed a race, want to re-watch a classic battle, or introduce a friend to the sport, we've got you covered.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">What We Offer</h2>
          <ul>
            <li>
              <strong>Full Race Replays:</strong> Access a growing library of full race replays from recent and classic F1 seasons.
            </li>
            <li>
              <strong>High-Quality Streams:</strong> We embed high-quality video streams to ensure you have the best viewing experience possible.
            </li>
            <li>
              <strong>Insightful Articles:</strong> Beyond replays, we offer articles, analysis, and opinion pieces to deepen your understanding and appreciation of Formula 1.
            </li>
            <li>
              <strong>Easy Navigation:</strong> Our site is designed to be fast, responsive, and easy to navigate, so you can find the race you're looking for in seconds.
            </li>
          </ul>
           <p className="mt-8 border-t border-f1-gray pt-6 text-gray-400">
            <strong>f1fullreplay.com</strong> is a fan-made project created for educational and entertainment purposes. We are not affiliated with the official Formula 1 organization. All content is sourced from publicly available embeds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;