const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function getTests() {
    return fetch(`/api/tests/all`)
}

export function getTest(id: string) {
    return fetch(`/api/tests/get?testId=${id}`)
}

export function uploadResult(testId, points, time, accuracy, mode) {
    let headers = {'Content-Type': 'application/json'};

    return fetch(`/api/result/upload`, {
        method: 'POST',
        headers,
        body: JSON.stringify({testId, points, time, accuracy, mode})
    })
}

export function sendResultAPI(token, testId, points, time, accuracy) {
    let headers = {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'};
    if(token && token !== "") headers.Authorization = `Bearer ${token}`;

    return fetch(`${apiUrl}/api/result/upload`, {
        method: 'POST',
        headers,
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
    return fetch(`${apiUrl}/api/user/info`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`}})
}

export function getUserData(nickname) {
    return fetch(`${apiUrl}/api/result/results?nickname=${nickname}`)
}