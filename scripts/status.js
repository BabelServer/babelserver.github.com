/// <reference types="jquery" />

$(function () {
    const $process = $("#current-process");

    $process.text("接続中");

    const url = "https://babel.segmentfault.xyz";

    let left = 30;
    const interval = setInterval(() => {
        if (left === 30) {
            $process.text("データを取得中");
            const ping = Date.now();
            getData()
                .then(data => {
                    $process.text("データを取得しました");

                    const pong = Date.now();

                    const latency = pong - ping;

                    $("#ping").text(`${latency}ms`);

                    console.log(data);

                    const players = data.minecraftServer.players;

                    // $("#uptime").text(
                    //     getDateString(
                    //         Date.now() - json.started,
                    //         "hh時間 mm分 ss秒"
                    //     )
                    // );
                    $("#uptime").text('不明');
                    $("#version").text(data.version);
                    $("#online").text(`${players.length}`);
                    $("#ip").text(`Requester: ${data.address}`);
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

    async function getData() {
        const res = await fetch(url + '/serverinfo');
        if(res.status !== 200){
            throw new Error('Not yet, or Unreachable');
        }

        const data = await res.json();

        return data;
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
