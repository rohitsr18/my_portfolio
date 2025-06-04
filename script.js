document.addEventListener('DOMContentLoaded', () => {
  // Project slider controls
  const slider = document.getElementById('projects-slider');
  const btnLeft = document.querySelector('.slider-btn.left');
  const btnRight = document.querySelector('.slider-btn.right');
  const username = 'rohitsr18';

  btnLeft.addEventListener('click', () => {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
  });

  btnRight.addEventListener('click', () => {
    slider.scrollBy({ left: 300, behavior: 'smooth' });
  });

  // Fetch GitHub repos and show most recently committed first
  async function fetchRepos() {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const repos = await res.json();

      // Filter repos with at least 1 star and sort by most recent commit
      const starredRepos = repos
        .filter(repo => repo.stargazers_count >= 1)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

      if (starredRepos.length === 0) {
        slider.innerHTML = `<p class="centered-error">No starred repositories found.</p>`;
        return;
      }

      slider.innerHTML = '';

      // Fetch commit counts for each repo in parallel (only by the repo owner)
      const commitPromises = starredRepos.map(async repo => {
        // Get commits authored by the repo owner (your username)
        const commitsUrl = `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=1`;
        const commitsRes = await fetch(commitsUrl);
        if (!commitsRes.ok) return { repo, commits: 'N/A' };

        // Get the total count from the 'link' header if paginated, else count the single commit
        const linkHeader = commitsRes.headers.get('Link');
        if (linkHeader) {
          // Extract the last page number from the link header
          const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
          return { repo, commits: match ? match[1] : 'N/A' };
        } else {
          // Only one page, so count the commits in the response
          const commits = await commitsRes.json();
          return { repo, commits: Array.isArray(commits) ? commits.length : 'N/A' };
        }
      });

      const reposWithCommits = await Promise.all(commitPromises);

      reposWithCommits.forEach(({ repo, commits }) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
          <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${escapeHTML(repo.name)}</a></h3>
          <p>${repo.description ? escapeHTML(repo.description) : 'No description'}</p>
          <div class="stars">⭐ ${repo.stargazers_count}</div>
          <div class="last-commit">Last commit: ${new Date(repo.pushed_at).toLocaleDateString()}</div>
          <div class="commit-count">Your commits: ${commits}</div>
        `;
        slider.appendChild(projectCard);
      });
    } catch (err) {
      slider.innerHTML = `<p class="centered-error">Error fetching projects: ${err.message}</p>`;
    }
  }

  // Escape HTML utility to prevent XSS
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  fetchRepos();

  // Fetch LeetCode stats
  const leetcodeUsername = "rohitsr18";
  async function fetchLeetCodeStats(username) {
    try {
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      if (data.status === "error") {
        document.getElementById("leetcode-stats").innerHTML = `<p class="centered-error">LeetCode profile not found or API error.</p>`;
        return;
      }

      document.getElementById("leetcode-stats").innerHTML = `
        <a href="https://leetcode.com/${escapeHTML(username)}" target="_blank" class="leetcode-card-link" rel="noopener noreferrer">
          <h3>LeetCode</h3>
          <p>User: <strong>${escapeHTML(username)}</strong></p>
          <p>Total Problems Solved: <strong>${escapeHTML(data.totalSolved)}</strong></p>
          <p>Ranking: <strong>${escapeHTML(data.ranking)}</strong></p>
          <p>Acceptance Rate: <strong>${escapeHTML(data.acceptanceRate)}</strong></p>
          <p class="click-note">Click to view full profile</p>
        </a>
      `;
    } catch {
      document.getElementById("leetcode-stats").innerHTML = `<p class="centered-error">Failed to fetch LeetCode data.</p>`;
    }
  }
  fetchLeetCodeStats(leetcodeUsername);

  // Fetch About section
  fetch('about.json')
    .then(response => response.json())
    .then(data => {
      const aboutText = document.getElementById('about-text');
      aboutText.textContent = data.about;
    })
    .catch(() => {
      document.getElementById('about-text').innerHTML = `<span class="centered-error">Unable to load About section at this time.</span>`;
    });

  // Animate on scroll
  function animateOnScroll() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Refresh page when logo is clicked
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.reload();
    });
  }
});

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const body = document.body;

  if (scrollY < 300) {
    body.style.background = "linear-gradient(to bottom right, rgba(139, 168, 211, 0.35),rgb(211, 176, 176))";
  } else if (scrollY >= 300 && scrollY < 800) {
    body.style.background = "linear-gradient(to bottom right, rgba(139, 168, 211, 0.35),rgb(211, 176, 176))";
  } else if (scrollY >= 800 && scrollY < 1400) {
    body.style.background = "linear-gradient(to bottom right,rgba(139, 168, 211, 0.35),rgb(211, 176, 176))";
  } else {
    body.style.background = "linear-gradient(to bottom right,rgba(139, 168, 211, 0.35),rgb(211, 176, 176))";
  }
  // SCROLL ANIMATIONS
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('DOMContentLoaded', animateOnScroll);
});
