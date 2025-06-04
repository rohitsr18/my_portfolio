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

  // Fetch GitHub repos
  async function fetchRepos() {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const repos = await res.json();
      const popularRepos = repos.filter(repo => repo.stargazers_count >= 1);

      if (popularRepos.length === 0) {
        slider.innerHTML = `<p>No starred repositories found.</p>`;
        return;
      }

      slider.innerHTML = '';

      popularRepos.forEach(repo => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
          <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
          <p>${repo.description || 'No description'}</p>
          <div class="stars">⭐ ${repo.stargazers_count}</div>
        `;
        slider.appendChild(projectCard);
      });
    } catch (err) {
      slider.innerHTML = `<p>Error fetching projects: ${err.message}</p>`;
    }
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
        document.getElementById("leetcode-stats").innerText = "LeetCode profile not found or API error.";
        return;
      }

      document.getElementById("leetcode-stats").innerHTML = `
        <a href="https://leetcode.com/${username}" target="_blank" class="leetcode-card-link">
          <h3>LeetCode</h3>
          <p>User: <strong>${username}</strong></p>
          <p>Total Problems Solved: <strong>${data.totalSolved}</strong></p>
          <p>Ranking: <strong>${data.ranking}</strong></p>
          <p>Acceptance Rate: <strong>${data.acceptanceRate}</strong></p>
          <p class="click-note">Click to view full profile</p>
        </a>
      `;
    } catch {
      document.getElementById("leetcode-stats").innerText = "Failed to fetch LeetCode data.";
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
      document.getElementById('about-text').textContent = "Unable to load About section at this time.";
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
