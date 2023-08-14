const time = (t) => {
    let hr = t.split(':')[0];
    let min = t.split(':')[1];
    let pm = false;
    if (parseInt(hr) > 12) {
      hr = Math.floor(parseInt(hr) / 12).toString();
      pm = true;
    }
    if (parseInt(hr) === 12) {
      pm = true;
    }
    if (parseInt(hr) < 9) {
      hr = "0" + hr;
    }
    if (parseInt(min) < 9) {
      min = "0" + min
    }
    const am = (pm) ? "PM" : "AM";
    console.log("aaaaa", hr, min)
    return hr + ":" + min + am;

  }

  const statusColor = (status) => {
    if (status === "Pending") {
      return ({ color: 'yellow' })
    }
    if (status === "Approved") {
      return ({ color: 'green' })
    }
    if (status === "Denied") {
      return ({ color: 'red' })
    }
  }

export {time,statusColor};
