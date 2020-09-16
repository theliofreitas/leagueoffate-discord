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
      throw new Error(err);
    }
  },  

  async createChallenge(challenge){
    try {
      const response = await fetch(`${baseUrl}/challenges`, {
          method: 'post',
          body: JSON.stringify(challenge),
          headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      return { response: response, data: data };
    }
    catch (err) {
      throw new Error(err);
    }
  },

  async validateChallenge(challengeId, challenge){
    try {
      const response = await fetch(`${baseUrl}/challenges/${challengeId}`, {
          method: 'patch',
          body: JSON.stringify(challenge),
          headers: { 'Content-Type': 'application/json' },
      });

      return { response: response };
    }
    catch (err) {
      throw new Error(err);
    }
  },

  async getChallengeById(challengeId){
    try {
      const response = await fetch(`${baseUrl}/challenges/${challengeId}`, {
          method: 'get',
      });

      const data = await response.json();
      return { response: response, data: data };
    }
    catch (err) {
      throw new Error(err);
    }
  }, 
}

export default LOFService;