let express = require('express');
let app = express();

app.get('/check_need_reboot', (req, res) => {
    res.end(JSON.stringify({
            "success": true,
            "ret": {
                "need_reboot": false,
                "msg": "报错需要重启，请重启。报错需要重启，请重启。报错需要重启，请重启。报错需要重启，请重启。报错需要重启，请重启。报错需要重启，请重启。"
            },
            "msg": ""
        }
    ))
});

app.listen(4396);
