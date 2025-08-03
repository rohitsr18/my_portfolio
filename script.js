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

        // Format last commit date as dd/mm/yyyy
        const pushedDate = new Date(repo.pushed_at);
        const day = String(pushedDate.getDate()).padStart(2, '0');
        const month = String(pushedDate.getMonth() + 1).padStart(2, '0');
        const year = pushedDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        projectCard.innerHTML = `
          <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${escapeHTML(repo.name)}</a></h3>
          <p>${repo.description ? escapeHTML(repo.description) : 'No description'}</p>
          <div class="stars">⭐ ${repo.stargazers_count}</div>
          <div class="last-commit">Last commit: ${formattedDate}</div>
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

  // Create LeetCode card in JS
  const profilesSection = document.getElementById('profiles');
  if (profilesSection) {
    // LeetCode Card
    const leetcodeCard = document.createElement('div');
    leetcodeCard.className = 'profile-card leetcode-card';
    leetcodeCard.innerHTML = `
      <a href="https://leetcode.com/rohitsr18" target="_blank" class="leetcode-card-link" rel="noopener noreferrer">
        <h3>
          <span style="vertical-align: middle; margin-right: 0.18em;">
            <!-- LeetCode SVG Icon -->
            <svg width="24" height="24" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;">
              <g>
                <path d="M41.5 36.2c-1.1 0-2.1-0.4-2.9-1.2l-13.2-13.2c-1.6-1.6-1.6-4.2 0-5.8l13.2-13.2c1.6-1.6 4.2-1.6 5.8 0s1.6 4.2 0 5.8L35.1 25l9.3 9.3c1.6 1.6 1.6 4.2 0 5.8-0.8 0.8-1.8 1.1-2.9 1.1z" fill="#FFA116"/>
                <path d="M8.5 36.2c-1.1 0-2.1-0.4-2.9-1.2-1.6-1.6-1.6-4.2 0-5.8L14.9 25l-9.3-9.3c-1.6-1.6-1.6-4.2 0-5.8s4.2-1.6 5.8 0l13.2 13.2c1.6 1.6 1.6 4.2 0 5.8L11.3 35c-0.8 0.8-1.8 1.2-2.8 1.2z" fill="#292D3D"/>
              </g>
            </svg>
          </span>
          LeetCode
        </h3>
        <p>User: <strong>rohitsr18</strong></p>
        <p id="leetcode-problems"></p>
        <p id="leetcode-rank"></p>
        <p id="leetcode-acceptance"></p>
        <p class="click-note">Click to view full profile</p>
      </a>
    `;
    // Insert as first card in profiles-horizontal
    const profilesRow = document.querySelector('.profiles-horizontal');
    if (profilesRow) profilesRow.insertBefore(leetcodeCard, profilesRow.firstChild);

    // Fetch LeetCode stats
    fetch('https://leetcode-stats-api.herokuapp.com/rohitsr18')
      .then(res => res.json())
      .then(data => {
        document.getElementById('leetcode-problems').innerHTML =
          `Total Problems Solved: <strong>${data.totalSolved ?? 'N/A'}</strong>`;
        document.getElementById('leetcode-rank').innerHTML =
          `Global Rank: <strong>${data.ranking ?? 'N/A'}</strong>`;
        document.getElementById('leetcode-acceptance').innerHTML =
          `Acceptance Rate: <strong>${data.acceptanceRate ?? 'N/A'}</strong>`;
      })
      .catch(() => {
        document.getElementById('leetcode-problems').innerHTML = 'Total Problems Solved: <strong>N/A</strong>';
        document.getElementById('leetcode-rank').innerHTML = 'Global Rank: <strong>N/A</strong>';
        document.getElementById('leetcode-acceptance').innerHTML = 'Acceptance Rate: <strong>N/A</strong>';
      });

    // CodeForces Card
    const codeforcesCard = document.createElement('div');
    codeforcesCard.className = 'profile-card codeforces-card';
    const cfUsername = 'rohitsr24';
    codeforcesCard.innerHTML = `
      <a href="https://codeforces.com/profile/${cfUsername}" target="_blank" class="codeforces-card-link" rel="noopener noreferrer">
        <h3>
          <span style="vertical-align: middle; margin-right: 0.5em;">
            <!-- CodeForces SVG Icon -->
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;">
              <rect x="4" y="6" width="4" height="12" fill="#F44336"/>
              <rect x="10" y="6" width="4" height="12" fill="#2196F3"/>
              <rect x="16" y="6" width="4" height="12" fill="#F44336"/>
            </svg>
          </span>
          CODEFORCES
        </h3>
        <p>User: <strong>${cfUsername}</strong></p>
        <p id="codeforces-solved"></p>
        <p id="codeforces-rank-rating"></p>
        <p id="codeforces-max-rank-rating"></p>
        <p class="click-note">Click to view full profile</p>
      </a>
    `;
    // Insert after LeetCode card
    if (profilesRow) profilesRow.insertBefore(codeforcesCard, leetcodeCard.nextSibling);

    // Fetch CodeForces stats
    const userInfoUrl = `https://codeforces.com/api/user.info?handles=${cfUsername}`;
    const userStatusUrl = `https://codeforces.com/api/user.status?handle=${cfUsername}`;

    // Helper to get CodeForces rank color
    const getCodeforcesColor = (rating) => {
      if (rating === null || rating === undefined) return '#000000'; // Black for unrated
      if (rating < 1200) return '#808080'; // Gray
      if (rating < 1400) return '#008000'; // Green
      if (rating < 1600) return '#03A89E'; // Cyan
      if (rating < 1900) return '#0000FF'; // Blue
      if (rating < 2100) return '#AA00AA'; // Violet
      if (rating < 2400) return '#FF8C00'; // Orange
      if (rating < 3000) return '#FF0000'; // Red
      return '#FF0000'; // Red for LGM
    };

    // Helper to capitalize strings
    const capitalize = (str) => {
      if (!str) return '';
      return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const fetchJson = (url, context) => fetch(url).then(res => {
      if (!res.ok) throw new Error(`CodeForces ${context} API error: ${res.status}`);
      return res.json();
    });

    Promise.all([
      fetchJson(userInfoUrl, 'userInfo'),
      fetchJson(userStatusUrl, 'userStatus')
    ]).then(([infoData, statusData]) => {
      // Process user info for rating and rank
      if (infoData.status !== 'OK') throw new Error(`CodeForces userInfo response: ${infoData.comment}`);
      const user = infoData.result[0];

      const rankEl = document.getElementById('codeforces-rank-rating');
      const maxRankEl = document.getElementById('codeforces-max-rank-rating');

      if (user.rating) {
        const color = getCodeforcesColor(user.rating);
        const rank = capitalize(user.rank);

        if (rank.toLowerCase().includes('legendary')) {
          const styledRank = `<span style="color: black;">${rank.charAt(0)}</span><span style="color: red;">${rank.slice(1)}</span>`;
          rankEl.innerHTML = `${styledRank} <strong style="color: ${color};">${user.rating}</strong>`;
        } else {
          rankEl.innerHTML = `<span style="font-weight: bold; color: ${color};">${rank}</span> <strong style="color: ${color};">${user.rating}</strong>`;
        }

        const maxColor = getCodeforcesColor(user.maxRating);
        const maxRank = capitalize(user.maxRank);
        maxRankEl.innerHTML = `Max: <span style="font-weight: bold; color: ${maxColor};">${maxRank}</span> <strong style="color: ${maxColor};">${user.maxRating}</strong>`;
      } else {
        rankEl.innerHTML = '<strong>Unrated</strong>';
        maxRankEl.innerHTML = '';
      }

      // Process user status for solved problems
      if (statusData.status !== 'OK') throw new Error(`CodeForces userStatus response: ${statusData.comment}`);
      const solvedProblems = new Set(statusData.result.filter(s => s.verdict === 'OK').map(s => `${s.problem.contestId}-${s.problem.index}`));
      document.getElementById('codeforces-solved').innerHTML = `Total Problems Solved: <strong>${solvedProblems.size}</strong>`;
    }).catch((err) => {
      console.error('Error fetching CodeForces stats:', err);
      document.getElementById('codeforces-solved').innerHTML = 'Total Problems Solved: <strong>N/A</strong>';
      document.getElementById('codeforces-rank-rating').innerHTML = 'Rank & Rating: <strong>N/A</strong>';
      document.getElementById('codeforces-max-rank-rating').innerHTML = '';
    });
  }

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