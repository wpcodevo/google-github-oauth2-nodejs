import axios from "axios";
import qs from "qs";

const GITHUB_OAUTH_CLIENT_ID = process.env
  .GITHUB_OAUTH_CLIENT_ID as unknown as string;
const GITHUB_OAUTH_CLIENT_SECRET = process.env
  .GITHUB_OAUTH_CLIENT_SECRET as unknown as string;

type GitHubOauthToken = {
  access_token: string;
};

export const getGithubOathToken = async ({
  code,
}: {
  code: string;
}): Promise<GitHubOauthToken> => {
  const rootUrl = "https://github.com/login/oauth/access_token";
  const options = {
    client_id: GITHUB_OAUTH_CLIENT_ID,
    client_secret: GITHUB_OAUTH_CLIENT_SECRET,
    code,
  };

  const queryString = qs.stringify(options);

  try {
    const { data } = await axios.post(`${rootUrl}?${queryString}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const decoded = qs.parse(data) as GitHubOauthToken;

    return decoded;
  } catch (err: any) {
    throw Error(err);
  }
};

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  email: string;
}

export const getGithubUser = async ({
  access_token,
}: {
  access_token: string;
}): Promise<GitHubUser> => {
  try {
    const { data } = await axios.get<GitHubUser>(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return data;
  } catch (err: any) {
    throw Error(err);
  }
};
