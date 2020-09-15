import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const baseUrl = process.env.LOF_BASE_URL;

const LOFService = {
  async getUserChallenges(summonerName){
    try {
      const response = await fetch(`${baseUrl}/challenges?summonerName=${summonerName}&status=open`, {
          method: 'get',
      });

      const data = await response.json();

      return { response: response, data: data };
    }
    catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}

export default LOFService;