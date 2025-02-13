import React, { useEffect } from 'react';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET;

const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`;

const GitHubOAuth = () => {
  const handleLogin = async (code) => {
    try {
      // Exchange code for an access token
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code
        }),
      });

      const data = await response.json();
      const accessToken = data.access_token;

      if (!accessToken) {
        throw new Error("Failed to get access token");
      }

      // Fetch the user's GitHub profile
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'WrapChat'
        }
      });

      const userProfile = await userResponse.json();

      console.log(`Welcome, ${userProfile.name}!`);
    } catch (error) {
      console.error("GitHub OAuth error:", error);
    }
  };

  const handleGitHubCallback = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');

    if (code) {
      handleLogin(code);
    }
  };

  useEffect(() => {
    handleGitHubCallback();
  }, []);

  return (
    <div>
      <a href={githubOAuthURL}>Sign in with GitHub</a>
    </div>
  );
};

export default GitHubOAuth;
