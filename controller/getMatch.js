const matches = require('../asset/IPL_Matches_Data.json');
/**
 * Function to fetch and filter match data
 * @param {any} options Object consisting of query parameters
 * @returns result - an array of matches with requested details
 */
function getMatch(options) {
    try {
        let result = [];
        result = options.MatchDate ? matches.filter(match => match.date.substring(0, 5) === options.MatchDate) : result;
        result = options.City ? matches.filter(match => match.city === options.City) : result;
        result = options.Venue ? matches.filter(match => match.venue === options.Venue) : result;
        result = options.Team1 ? matches.filter(match => match.team1 === options.Team1 || match.team2 === options.Team1) : result;
        result = options.Team2 ? matches.filter(match => (match.team1 === options.Team1 && match.team2 === options.Team2) || (match.team1 === options.Team2 && match.team2 === options.Team1)) : result;
        return result;
    } catch (error) {
        console.log(error);
    }
}

module.exports = getMatch;