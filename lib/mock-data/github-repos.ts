export interface GithubRepoOption {
  fullName: string;
  description: string;
  preselected: boolean;
}

export const githubOrgRepos: GithubRepoOption[] = [
  {
    fullName: "ordino-labs/booking-website",
    description: "Customer-facing booking site (this project's primary repo).",
    preselected: true,
  },
  {
    fullName: "ordino-labs/booking-api",
    description: "Backend API booking-website depends on for pricing and checkout.",
    preselected: true,
  },
  {
    fullName: "ordino-labs/booking-mobile",
    description: "Mobile app that also depends on booking-api's checkout endpoints.",
    preselected: true,
  },
  {
    fullName: "ordino-labs/internal-tools",
    description: "Internal tooling, unrelated to the booking flow.",
    preselected: false,
  },
];
