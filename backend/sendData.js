
const sendData =async () => {
  const job = {"id":"179223","name":"__default__","data":{"url":"https://144.76.218.59/apiv2/user/create/telegram","userData":{"id":"544112311","username":"Dim_Kovalchuk","first_name":"Дмитро","last_name":"Ковальчук","photo_url":"","referral":"undefined","is_premium":false,"chat_id":"544112311","code":"8zy7qv3dcf"},"headers":{"Content-Type":"application/json","client-id":"2_5d89walcejk0okwcws0g8s0ow4og8c0s8go08sco0gsw4o4wcs","client-secret":"4a5kadsghksg8g0c8kwk8ksg0k0wokcscgkgo0owggoggk8o44","Host":"api.beta.ghostdrive.com"}},"opts":{"attempts":10,"backoff":{"type":"exponential","delay":1000},"delay":0,"timestamp":1729247287109},"progress":0,"delay":0,"timestamp":1729247287109,"attemptsMade":0,"stacktrace":[],"returnvalue":null,"debounceId":null,"finishedOn":null,"processedOn":null}
  try {
    const {userData, headers, showMobileAuthButton,url} = job.data;
    console.log('in job process, before fetch', { userData, headers, showMobileAuthButton });
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(userData),
      timeout: 180000 // 3 minutes in milliseconds
    });

    console.log(
      'Error http',
      {
        s: response.status,
        statusText: response.statusText,
        e: await response.text(),
        url,
        userData,
        headers
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    console.log('asdasdasd =>', { data })
  } catch (e) {
    console.error('Error in sendData:', e);
  }
}

sendData()
