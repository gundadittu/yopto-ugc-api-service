const axios = require('axios');
const yotpoHelpers = require('./helper'); 

export async function fetchAccessToken( 
    apiKey, 
    apiSecret, 
    grantType="client_credentials"
) { 
    const url = 'https://api.yotpo.com/oauth/token';
    const res = await axios.get(url, { 
        params: { 
            "client_id": apiKey, 
            "client_secret": apiSecret, 
            "grant_type": grantType, 
        }
    });
    const data = res["data"]; 
    const access_token = data ? data["access_token"] : null; 
    const token_type = data ? data["token_type"] : null; 
    // TODO: throw error if access_token and token_type is null
    return access_token; 
}

export async function fetchAllReviews(
    apiKey, 
    accessToken, 
    optionalSearchParams={}
) { 
    const url = yotpoHelpers.constructRetrieveAllReviewsUrl(apiKey, accessToken, optionalSearchParams);
    const res = await axios.get(url); 
    return res["data"];
}

// {
//     "reviews": [
//       {
//         "id": 248989899,
//         "title": "test review 1",
//         "content": "test review",
//         "score": 4,
//         "votes_up": 0,
//         "votes_down": 0,
//         "created_at": "2021-04-22T02:18:31.000Z",
//         "updated_at": "2021-04-22T02:53:35.000Z",
//         "sentiment": 0.589802,
//         "sku": "6640762945709",
//         "name": "dittu",
//         "email": "dittukg@gmail.com",
//         "reviewer_type": "verified_reviewer",
//         "deleted": false,
//         "archived": false,
//         "escalated": false
//       },
//     ]
// }