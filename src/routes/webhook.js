const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const ChangeValue = nameDay => {
  let _day = nameDay.toLowerCase();
  let _data;
  if (_day === 'sun' || _day === 'sunday' || _day === 'อาทิตย์') {
    _data = 'Sunday';
  } else if (_day === 'mon' || _day === 'monday' || _day === 'จันทร์') {
    _data = 'Monday';
  } else if (_day === 'tue' || _day === 'tuesday' || _day === 'อังคาร') {
    _data = 'Tuesday';
  } else if (_day === 'wed' || _day === 'wednesday' || _day === 'พุธ') {
    _data = 'Wednesday';
  } else if (_day === 'thu' || _day === 'thursday' || _day === 'พฤหัสบดี') {
    _data = 'Thursday';
  } else if (_day === 'fri' || _day === 'friday' || _day === 'ศุกร์') {
    _data = 'Friday';
  } else if (_day === 'sat' || _day === 'saturday' || _day === 'เสาร์') {
    _data = 'Saturday';
  }

  return _data;
};
const tempLine = () => {
  const temp = {
    type: 'flex',
    altText: 'I-Am-Teemo Flex Message',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'คุณเกิดวันอะไร...?',
            size: 'lg',
            align: 'center',
            color: '#123457'
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: []
      }
    }
  };
  const dtls = [
    { color: '#f40321', text: 'Sunday' },
    { color: '#f4efaf', text: 'Mondey' },
    { color: '#ffafc3', text: 'Tuesday' },
    { color: '#63ecdb', text: 'Wednesday' },
    {
      color: '#ff9c7e',
      text: 'Thursday'
    },
    { color: '#84cee8', text: 'Friday' },
    { color: '#cba4db', text: 'Saturday' }
  ];
  let _data;
  const _datas = [];
  for (let i = 0; i < dtls.length; i++) {
    _data = {
      type: 'button',
      color: `${dtls[i].color}`,
      style: 'primary',
      action: {
        type: 'message',
        label: `${dtls[i].text}`,
        text: `${dtls[i].text}`
      }
    };
    _datas.push(_data);
  }
  temp.contents.body.contents = _datas;

  return temp;
};
const chooseDay = nameDay => {
  let data;
  let titleMoney = 'สีมงคลเสริมดวงการเงิน';
  let titleWork = 'สีมงคลเสริมดวงการงาน';
  let titleLove = 'สีมงคลเสริมดวงความรัก';
  let _day = ChangeValue(nameDay);

  if (_day === 'Sunday') {
    data = {
      dtlMoney: 'ดำ ม่วง',
      dtlWork: 'แดง',
      dtlLove: 'เขียว เทา ทอง'
    };
  } else if (_day === 'Monday') {
    data = {
      dtlMoney: 'ส้ม เหลืองแก่',
      dtlWork: 'ชมพู เขียว ฟ้า',
      dtlLove: 'น้ำเงิน ทอง'
    };
  } else if (_day === 'Tuesday') {
    data = {
      dtlMoney: 'น้ำตาล',
      dtlWork: 'ม่วงแก่ ดำ เทา แดง',
      dtlLove: 'เขีียว ชมพู'
    };
  } else if (_day === 'Wednesday') {
    data = {
      dtlMoney: 'ม่วงแก่',
      dtlWork: 'น้ำตาล ทอง ขาว เหลืองอ่อน น้ำเงิน ฟ้า',
      dtlLove: 'เขียว ดำ'
    };
  } else if (_day === 'Thursday') {
    data = {
      dtlMoney: 'ฟ้า ทอง',
      dtlWork: 'เขียว ขาว',
      dtlLove: 'เทา บรอนซ์ ส้ม'
    };
  } else if (_day === 'Friday') {
    data = {
      dtlMoney: 'น้ำตาล ฟ้า น้ำเงิน',
      dtlWork: 'ทอง เหลือง',
      dtlLove: 'ดำ เขียว'
    };
  } else if (_day === 'Saturday') {
    data = {
      dtlMoney: 'เทา บรอนซ์',
      dtlWork: 'ชมพู ทอง เหลือง',
      dtlLove: 'ดำ ม่วงแก่ แดง'
    };
  }
  if (data) {
    data.dtlMoney = `${titleMoney} คือ ${data.dtlMoney}`;
    data.dtlWork = `${titleWork} คือ ${data.dtlWork}`;
    data.dtlLove = `${titleLove} คือ ${data.dtlLove}`;
  }

  return data;
};
module.exports.webhook = async app => {
  app.post('/webhook', (req, res) => {
    try {
      const agent = new WebhookClient({
        request: req,
        response: res
      });
      let _data = tempLine();
      let payload = new Payload(`LINE`, _data, { sendAsMessage: true });

      function color(agent) {
        const nameDay = req.body.queryResult.parameters.any;
        let data = chooseDay(nameDay);
        if (data) {
          agent.add(data.dtlMoney);
          agent.add(data.dtlWork);
          agent.add(data.dtlLove);
        } else {
          agent.add(req.body.queryResult.fulfillmentText);
          agent.add(payload);
        }
      }

      function custom(agent) {
        const nameDay = req.body.queryResult.parameters.date;
        let data = chooseDay(nameDay);
        if (data) {
          agent.add(data.dtlMoney);
          agent.add(data.dtlWork);
          agent.add(data.dtlLove);
        } else {
          agent.add(req.body.queryResult.fulfillmentText);
        }
      }
      let intentMap = new Map();
      intentMap.set('Auspicious color', color);
      intentMap.set('Auspicious color - custom', custom);

      agent.handleRequest(intentMap);
    } catch (error) {
      console.error(error.toString());
    }
  });
};
