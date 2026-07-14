export interface GithubRepoOption {
  fullName: string;
  description: string;
  preselected: boolean;
  ownedByYourTeam: boolean;
  /** Team lead to notify on Slack when Ordino opens a PR against this repo. Absent for owned repos. */
  leadName?: string;
}

export const githubOrgRepos: GithubRepoOption[] = [
  {
    fullName: "ordino-labs/booking-website",
    description: "Customer-facing booking site (this project's primary repo).",
    preselected: true,
    ownedByYourTeam: true,
  },
  {
    fullName: "ordino-labs/booking-api",
    description: "Backend API booking-website depends on for pricing and checkout.",
    preselected: true,
    ownedByYourTeam: false,
    leadName: "Marcus Chen",
  },
  {
    fullName: "ordino-labs/booking-mobile",
    description: "Mobile app that also depends on booking-api's checkout endpoints.",
    preselected: true,
    ownedByYourTeam: false,
    leadName: "Aisha Okonkwo",
  },
  {
    fullName: "ordino-labs/internal-tools",
    description: "Internal tooling, unrelated to the booking flow.",
    preselected: false,
    ownedByYourTeam: false,
    leadName: "Ravi Deshpande",
  },
];

export function shortRepoName(fullName: string): string {
  return fullName.split("/").pop() ?? fullName;
}
