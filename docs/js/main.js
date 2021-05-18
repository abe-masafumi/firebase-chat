(() => {

  'use strict';
  const firebaseConfig = {
    apiKey: ,
    authDomain: "chat-app01-be590.firebaseapp.com",
    projectId: "chat-app01-be590",
    storageBucket: "chat-app01-be590.appspot.com",
    messagingSenderId: "238401347229",
    appId: "1:238401347229:web:57854a955fc2b83b203e74"
  };
  firebase.initializeApp(firebaseConfig);

  // firestore=データベース
  const db = firebase.firestore();
  // 時間の設定
  // db.settings({
  //   timestampsInSnapshots: true
  // });

  //  collectionはドキュメントを保存する場所　messagesを作成
  const collection = db.collection('messages');

  const auth = firebase.auth();
  let me = null;

  const message = document.getElementById('message');
  const form = document.querySelector('form');
  const messages = document.getElementById('messages');
  const login = document.getElementById('login');
  const logout = document.getElementById('logout');

  login.addEventListener('click', () => {
    auth.signInAnonymously();
  });

  logout.addEventListener('click', () => {
    auth.signOut();
  });


  // ユーザーがログインしているか確認
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log(user);
      me = user;
      localStorage.setItem('user', user.uid);

      while (messages.firstChild) {
        messages.removeChild(messages.firstChild);
      }

      // 新しい順位並べる
      collection.orderBy('created').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {

            // リストの作成
            const d = change.doc.data();

            const user = firebase.auth().currentUser;
            // console.log(nameField.val);
            if (localStorage.getItem('user')) { // 値が保存されていれば 
              // const user1 = localStorage.getItem('user'); // データを取得
              // $('#text_area').val(text); // 取得したデータで上書き 
            }


              if (user.uid == d.uid) {
                console.log(user);
                console.log(user.uid);

                const li = document.createElement('li');
                li.classList.add('left_side');
                const div = document.createElement('biv');
                div.classList.add('pic');
                li.appendChild(div);
                const img = document.createElement('img');
                img.src = "./img/チップ5.png";
                div.appendChild(img);
                const div1 = document.createElement('biv');
                div1.classList.add('text');
                li.appendChild(div1);

                // img.src = "./img/チップ5.png";
                // li.textContent = d.uid.substr(0, 8) + ' : ' + d.message;
                div1.textContent = d.uid.substr(0, 8) + ' : ' + d.message;;
                messages.appendChild(li);
              } else {
                const li = document.createElement('li');
                li.classList.add('right_side');
                const div = document.createElement('biv');
                div.classList.add('pic');
                li.appendChild(div);
                const img = document.createElement('img');
                img.src = "./img/チップ10.png";
                div.appendChild(img);
                const div1 = document.createElement('biv');
                div1.classList.add('text');
                li.appendChild(div1);

                // const d = change.doc.data();
                // img.src = "./img/チップ5.png";
                // li.textContent = d.uid.substr(0, 8) + ' : ' + d.message;
                div1.textContent = d.uid.substr(0, 8) + ' : ' + d.message;;
                messages.appendChild(li);
                li.classList.add('right_side');
              }

              // if (user == me) {
              // li.classList.add('left_side');
              // } else {
              // li.classList.add('right_side');
              // }

              // const div = document.createElement('biv');
              // div.classList.add('pic');
              // li.appendChild(div);
              // const img = document.createElement('img');
              // // img.src = "./img/チップ5.png";
              // div.appendChild(img);
              // const div1 = document.createElement('biv');
              // div1.classList.add('text');
              // li.appendChild(div1);

              // const d = change.doc.data();
              // img.src = "./img/チップ5.png";
              // // li.textContent = d.uid.substr(0, 8) + ' : ' + d.message;
              // div1.textContent = d.uid.substr(0, 8) + ' : ' + d.message;;
              // messages.appendChild(li);
            }
          });
      }, error => { });
      console.log(`Logged in as: ${user.uid}`);
      login.classList.add('hidden');
      [logout, form, messages].forEach(el => {
        el.classList.remove('hidden');
      });
      message.focus();
      return;
    }

    me = null;
    console.log('nobody');
    login.classList.remove('hidden');
    [logout, form, messages].forEach(el => {
      el.classList.add('hidden');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    // console.log(e);
    const val = message.value.trim();
    if (val === "") {
      return;
    }
    // リストの作成
    // const li = document.createElement('li');
    // li.textContent = val;
    // messages.appendChild(li);

    message.value = "";
    message.focus();

    // データベースに追加
    collection.add({
      message: val,
      // 時間の設定
      created: firebase.firestore.FieldValue.serverTimestamp(),
      uid: me ? me.uid : 'nobody'
    })
      .then(doc => {
        console.log(`${doc.id} added!`);

      })
      .catch(error => {

        console.log("document,add");
        console.log(error);
      });
  });

})();

