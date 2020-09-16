import dotenv from 'dotenv';
import fetch, { Headers } from 'node-fetch';

dotenv.config();

const baseUrl = process.env.RIOT_BASE_URL;
const riotToken = process.env.RIOT_API_TOKEN;
const headers = new Headers({
  'X-Riot-Token': riotToken
});

const RiotService = {
  async getSummonerId(summonerName){
    try {
      const response = await fetch(`${baseUrl}/summoner/v4/summoners/by-name/${summonerName}`, {
          method: 'get',
          headers: headers,
      });

      const data = await response.json();

      return { response: response, data: data };
    }
    catch (err) {
      throw new Error(err);
    }
  },
  async getLastMatch(accountId){
    try {
      const response = await fetch(`${baseUrl}/match/v4/matchlists/by-account/${accountId}`, {
          method: 'get',
          headers: headers,
      });

      const data = await response.json();
      const lastMatch = data.matches[0];

      return { response: response, data: lastMatch };
    }
    catch (err) {
      throw new Error(err);
    }
  }
}

export default RiotService;