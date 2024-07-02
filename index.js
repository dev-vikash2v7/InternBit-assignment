const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const slackAuthToken = 'xoxb-7352734840357-7363044688005-C7FY1RZNXsj3INgbIG22Zzlm'; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle the global shortcut
app.post('/slack/actions', async (req, res) => {
    
  const { payload } = req.body;
  const action = JSON.parse(payload);

  console.log('action '  , action)


  if (action.type === 'shortcut' && action.callback_id === 'open_message_dialog') {
    const triggerId = action.trigger_id;

    const dialog = {
      trigger_id: triggerId,
      dialog: {
        callback_id: 'send_message',
        title: 'Send a Message',
        elements: [
          {
            type: 'select',
            label: 'Select User',
            name: 'user',
            data_source: 'users'
          },
          {
            type: 'textarea',
            label: 'Message',
            name: 'message'
          }
        ]
      }
    };

    await axios.post('https://slack.com/api/dialog.open', dialog, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${slackAuthToken}`
      }
    });

    res.send('');
  }


 else if (action.type === 'dialog_submission' && action.callback_id === 'send_message') {
    const { user, message } = action.submission;

    await axios.post('https://slack.com/api/chat.postMessage', {
      channel: user,
      text: message
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${slackAuthToken}`
      }
    });

    res.send('');
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
