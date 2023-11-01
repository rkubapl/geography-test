const apiUrl = process.env.REACT_APP_API_URL;

export function sendResultAPI(token, testId, points, time, accuracy) {
    return fetch(`${apiUrl}/api/result/create`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({testId, points, time, accuracy})
    })
}

export function getLeaderboardData(testId) {
    return fetch(`${apiUrl}/api/result/leaderboard?testId=${testId}`);
}

export function handleUserAPI(mode, nickname, password) {
    return fetch(`${apiUrl}/api/user/` + mode,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nickname, password})
            }
    )
}

export function getUserInfo(token) {
    return fetch(`${apiUrl}/api/user/user`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`}})
}