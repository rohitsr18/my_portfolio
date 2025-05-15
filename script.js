document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('projects-slider');
  const btnLeft = document.querySelector('.slider-btn.left');
  const btnRight = document.querySelector('.slider-btn.right');
  const username = 'rohitsr24'; // Replace this

  btnLeft.addEventListener('click', () => {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
  });

  btnRight.addEventListener('click', () => {
    slider.scrollBy({ left: 300, behavior: 'smooth' });
  });

  async function fetchRepos() {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const repos = await res.json();

      // Filter repos with at least 1 star
      const popularRepos = repos.filter(repo => repo.stargazers_count >= 1);

      if (popularRepos.length === 0) {
        slider.innerHTML = `<p>No starred repositories found.</p>`;
        return;
      }

      slider.innerHTML = ''; // Clear loading message

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
    } catch (error) {
      document.getElementById("leetcode-stats").innerText = "Failed to fetch LeetCode data.";
      console.error(error);
    }
  }

  fetchLeetCodeStats(leetcodeUsername);
});

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const body = document.body;

  if (scrollY < 300) {
    body.style.background = "linear-gradient(to bottom right, #f0f0f0, #e8e8ff)";
  } else if (scrollY >= 300 && scrollY < 800) {
    body.style.background = "linear-gradient(to bottom right, #ffe0e0,rgb(196, 168, 168))";
  } else if (scrollY >= 800 && scrollY < 1400) {
    body.style.background = "linear-gradient(to bottom right,rgb(188, 212, 188),rgba(184, 206, 191, 0.96))";
  } else {
    body.style.background = "linear-gradient(to bottom right,rgba(139, 168, 211, 0.35),rgb(211, 176, 176))";
  }
});

