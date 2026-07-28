interface GitHubRepo {
  owner: string;
  repo: string;
}

interface GitHubResponse {
  stargazers_count: number;
}

interface ContributionResponse {
  contributions: GitHubContribution[];
}

export interface GitHubContribution {
  date: string;
  count: number;
  level: number;
}

function parseGitHubRepo(githubUrl: string): GitHubRepo | null {
  try {
    const url = new URL(githubUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }

    return {
      owner: parts[0],
      repo: parts[1],
    };
  } catch {
    return null;
  }
}

function parseCompactNumber(value: string): number | null {
  const normalized = value.trim().toLowerCase().replace(/,/g, "");
  if (!normalized) {
    return null;
  }

  if (normalized.endsWith("k")) {
    const base = Number.parseFloat(normalized.slice(0, -1));
    return Number.isFinite(base) ? Math.round(base * 1000) : null;
  }

  if (normalized.endsWith("m")) {
    const base = Number.parseFloat(normalized.slice(0, -1));
    return Number.isFinite(base) ? Math.round(base * 1_000_000) : null;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

async function getStarsFromGitHubApi(owner: string, repo: string): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "AarusPortfolio",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: GitHubResponse = await response.json();
    const stars = Number(data.stargazers_count ?? 0);
    return Number.isFinite(stars) ? stars : null;
  } catch {
    return null;
  }
}

async function getStarsFromShields(owner: string, repo: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://img.shields.io/github/stars/${owner}/${repo}?style=social`,
      {
        headers: {
          "User-Agent": "AarusPortfolio",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const svg = await response.text();
    const direct = svg.match(/id="rlink"[^>]*>\s*([^<]+)\s*<\/text>/i);
    const fallback = svg.match(/<text[^>]*>\s*([0-9.,]+[kKmM]?)\s*<\/text>/g);

    if (direct?.[1]) {
      return parseCompactNumber(direct[1]);
    }

    if (fallback?.length) {
      const last = fallback[fallback.length - 1].match(/>\s*([^<]+)\s*<\//);
      if (last?.[1]) {
        return parseCompactNumber(last[1]);
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function getGitHubStars(githubUrl: string): Promise<number> {
  const parsed = parseGitHubRepo(githubUrl);
  if (!parsed) {
    return 0;
  }

  const { owner, repo } = parsed;

  const apiStars = await getStarsFromGitHubApi(owner, repo);
  if (apiStars !== null) {
    return apiStars;
  }

  const fallbackStars = await getStarsFromShields(owner, repo);
  if (fallbackStars !== null) {
    return fallbackStars;
  }

  console.warn(`Failed to fetch stars for ${owner}/${repo} from all sources.`);
  return 0;
}

export async function getGitHubContributions(username: string): Promise<GitHubContribution[]> {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      {
        headers: {
          "User-Agent": "AarusPortfolio",
        },
      },
    );

    if (!response.ok) {
      console.warn(`Failed to fetch contributions for ${username}: ${response.statusText}`);
      return [];
    }

    const data: ContributionResponse = await response.json();
    if (!Array.isArray(data.contributions)) {
      return [];
    }

    return data.contributions
      .filter((entry) => typeof entry.date === "string")
      .map((entry) => ({
        date: entry.date,
        count: Number.isFinite(entry.count) ? entry.count : 0,
        level: Number.isFinite(entry.level) ? entry.level : 0,
      }));
  } catch (error) {
    console.error(`Error fetching contributions for ${username}:`, error);
    return [];
  }
}

export async function getAllProjectStars<
  T extends { data: { github?: string } }
>(projects: T[]) {
  const starsPromises = projects.map(async (project) => {
    if (!project.data.github) {
      return {
        ...project,
        stars: 0,
      };
    }

    const stars = await getGitHubStars(project.data.github);

    return {
      ...project,
      stars,
    };
  });

  return Promise.all(starsPromises);
}
