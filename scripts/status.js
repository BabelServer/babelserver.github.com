$(function () {
    const $process = $("#current-process");

    $process.text("接続中");

    const url = "wss://p4725016-ipxg23301hodogaya.kanagawa.ocn.ne.jp:44777";
    const ws = new WebSocket(url);

    ws.onopen = function (socket) {
        $process.text("接続しました");

        ws.send(JSON.stringify({ request: 1 }));

        let left = 30;
        const interval = setInterval(() => {
            if (ws.readyState !== WebSocket.OPEN) {
                clearInterval(interval);
                return;
            }
            if (left === 30) {
                $process.text("データを取得中");
                const ping = Date.now();
                getData()
                    .then(data => {
                        $process.text("データを取得しました");
                        const pong = Date.now();
                        const latency = pong - ping;
                        $("#ping").text(`${latency}ms`);
                        const json = JSON.parse(data.data);
                        console.log(json)
                        const players = json.server.players;
                        $("#uptime").text(
                            getDateString(
                                Date.now() - json.started,
                                "hh時間 mm分 ss秒"
                            )
                        );
                        $("#version").text(json.version);
                        $("#online").text(
                            `${players.length} / ${json.server.max}`
                        );
                        $("#ip").text(`Requester: ${json.userPermission.name}`);
                        $("#players").empty();
                        players.forEach(p => {
                            $("#players").append(`<p class="player">${p}</p>`);
                        });
                    })
                    .catch(() => {
                        $process.text("データの取得に失敗しました");
                        clearInterval(interval);
                        return;
                    });
            } else if (left <= 0) {
                left = 31;
                $process.text("データを取得中");
            } else $process.text(`${left}秒後に更新します`);

            left--;
        }, 1000);
    };

    ws.onclose = function () {
        $process.text("接続が切断されました");
        setTimeout(() => {
            location.reload();
        }, 3000);
    };

    ws.onerror = function (error) {
        $process.text("接続に失敗しました");
        setTimeout(() => {
            location.reload();
        }, 3000);
    };

    function getData() {
        const deferred = $.Deferred();

        let success = false;

        ws.send(JSON.stringify({ request: 1 }));

        setTimeout(() => {
            if (!success) {
                deferred.reject();
            }
        }, 3000);

        ws.onmessage = function (data) {
            success = true;
            deferred.resolve(data);
        };

        return deferred.promise();
    }

    function getDateString(dateString, format) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const millisecond = date.getMilliseconds();
        const formatted = format
            .replace(/yyyy/g, year)
            .replace(/MM/g, `0${month}`.slice(-2))
            .replace(/dd/g, `0${day}`.slice(-2))
            .replace(/hh/g, `0${hour}`.slice(-2))
            .replace(/mm/g, `0${minute}`.slice(-2))
            .replace(/ss/g, `0${second}`.slice(-2))
            .replace(/sss/g, `00${millisecond}`.slice(-3));
        return formatted;
    }
});
