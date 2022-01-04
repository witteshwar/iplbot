//Import Dependencies
const { Router } = require("express");
const getMatch = require('./controller/getMatch');

//Import Models
const RichContentMessage = require("./model/richContentMessage");
const TextMessage = require('./model/textMessage');

//Import Templates
const responses = require('./asset/responseTemplate.json');
const teams = require('./asset/teamMapping.json');

function main() {
    async function webhook(request, response) { //webhook function for IPL queries
        let fulfillmentMessages = [{ payload: { richContent: [[]] } }];
        try {
            const intent = request.body.queryResult.intent.displayName; //get Intent Name
            const parameters = request.body.queryResult.parameters; //get Parameters/Entities
            let matchDetails = false;
            let result = [];
            switch (intent) { // handle IPL intents
                case 'IPL_Starter': //For generic IPL query
                    fulfillmentMessages.unshift(new TextMessage(responses.IPLStarterText));
                    for (let option of responses.IPLStarterOptions) {
                        fulfillmentMessages[1].payload.richContent[0].push(new RichContentMessage(option))
                    }
                    break;
                case 'Match_ByDate': //For match by date query
                    matchDetails = true;
                    let { MatchDate } = parameters;
                    MatchDate = MatchDate.substring(0, 10).split('-').reverse().join('/').substring(0, 5);
                    result = getMatch({ MatchDate });
                    break;
                case 'Match_ByVenue': //For match by venue query
                case 'Match_ByCity': //For match by city query
                case 'Match_ByTeam - single': //For match by single team query
                case 'Match_ByTeam - versus': //For match by two teams query
                    matchDetails = true;
                    result = getMatch(parameters);
                    break;
                case 'Match_ByTeam': //For match by team prompt
                    fulfillmentMessages.unshift(new TextMessage(responses.TeamPrompt));
                    for (let option of responses.TeamOption) {
                        fulfillmentMessages[1].payload.richContent[0].push(new RichContentMessage(option))
                    }
                    break;
                default: //any other query (Backup)
                    fulfillmentMessages.push(new TextMessage(responses.Fallback));
                    break;
            }
            if (matchDetails) {
                if (result.length === 0) {
                    fulfillmentMessages.push(new TextMessage(responses.NoMatch));
                }
                else if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        fulfillmentMessages[0].payload.richContent[0].push(new RichContentMessage({ //building match detail card
                            type: "accordion",
                            title: responses.CardMessage.title.replace('<team1>', result[i].team1).replace('<team2>', result[i].team2),
                            subtitle: responses.CardMessage.subtitle
                                .replace('<winner>', result[i].result !== "tie" ? result[i].winner : "none(Tie)")
                                .replace('<diff>', result[i].win_by_wickets !== '0' ? `${result[i].win_by_wickets} wickets` : result[i].win_by_runs !== '0' ? `${result[i].win_by_runs} runs` : 'no difference'),
                            image: { src: { rawUrl: teams[result[i].winner].imageUri } },
                            text: responses.CardMessage.text
                                .replace('<team1>', result[i].team1)
                                .replace('<team2>', result[i].team2)
                                .replace('<winner>', result[i].result !== "tie" ? result[i].winner : "none(Tie)")
                                .replace('<diff>', result[i].win_by_wickets !== '0' ? `${result[i].win_by_wickets} wickets` : result[i].win_by_runs !== '0' ? `${result[i].win_by_runs} runs` : 'no difference')
                                .replace('<withDL>', result[i].dl_applied !== '0' ? ' with DL' : '')
                                .replace('<date>', result[i].date)
                                .replace('<venue>', result[i].venue)
                                .replace('<city>', result[i].city)
                                .replace('<toss_winner>', result[i].toss_winner)
                                .replace('<toss_decision>', result[i].toss_decision)
                                .replace('<player_of_match>', result[i].player_of_match)
                        })
                        );
                    }
                }
            }
            response.json({ fulfillmentMessages }); //sending response
        } catch (error) {
            console.log(error);
            fulfillmentMessages.push(new TextMessage(responses.Error)); //To handle Errors
        }

    }
    function configRouter() { //Route incoming request
        const webRouter = Router();
        webRouter.post('/', webhook);
        return webRouter;
    }
    return { webhook, configRouter };
};

module.exports = main();
