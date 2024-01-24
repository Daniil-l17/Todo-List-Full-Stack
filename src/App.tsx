import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './main';
import { useInput } from './hooks/useInput';
import { ArrowUpFromDot, Check, Plus, Trash2 } from 'lucide-react';
import { arrayRemove, arrayUnion, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

interface Ipost {
  did: boolean;
  value: string;
}

function App() {
  const [inputValue, setInputValue] = useState({ email: '', password: '' });

  const [user, loading, error] = useAuthState(auth);
  const [post, setPost] = useState<Ipost[]>([]);

  const value = useInput();

  const dsdsdv = (el: { did: boolean; value: string }) => {
    if (user?.email) {
      const washingtonRef = doc(db, 'users', user.email);
      updateDoc(washingtonRef, {
        post: [{ ...el, did: !el.did }],
      });
    }
  };

  useEffect(() => {
    if (user) {
      onSnapshot(doc(db, 'users', `${user?.email}`), doc => {
        setPost(doc.data()?.post);
      });
    }
  }, [user?.email]);

  const LoginEmail = () => {
    createUserWithEmailAndPassword(auth, inputValue.email, inputValue.password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('create ' + user);
        setDoc(doc(db, 'users', inputValue.email), {
          post: [],
        });
        setInputValue({ email: '', password: '' });
      })
      .catch(errre => {
        alert(user ? 'Вы авторизованы' : 'Пороль должен состоять и 6 символов');
        console.log(errre);
      });
  };

  const addDelo = async () => {
    const userEmail = user?.email;
    if (userEmail && value.value.length > 0) {
      const washingtonRef = doc(db, 'users', userEmail);
      await updateDoc(washingtonRef, {
        post: arrayUnion({
          value: value.value,
          did: false,
        }),
      });
      value.setValue('')
    }
  };

  const deletePost = (el: {}) => {
    const userEmail = user?.email;
    if (userEmail) {
      const washingtonRef = doc(db, 'users', userEmail);
      updateDoc(washingtonRef, {
        post: arrayRemove(el),
      });
    }
  };

  const signInWitEmail = () => {
    signInWithEmailAndPassword(auth, inputValue.email, inputValue.password)
      .then(() => {
        console.log('успешный вход');
        setInputValue({ email: '', password: '' });
      })
      .catch(() => {
        alert('Такого пользователя нету');
      });
  };

  const exitUser = () => {
    signOut(auth)
      .then(() => {
        console.log('вы вышли');
        setPost([]);
      })
      .catch(() => {
        alert('Вы не авторизованны');
      });
  };

  return (
    <div className="flex justify-center items-center h-[100vh] ">
      <div
        style={{
          border: '1px solid #8fa8c262',
          boxShadow: ' 14px 13px 67px 55px rgba(133, 84, 152, 0.11)',
        }}
        className=" py-3 px-4 min-w-[600px] min-h-[700px] rounded-xl bg-[#d3aeec37]">
        {!error ? (
          <>
            <h1 className="uppercase font-semibold text-center text-[26px] ">Todo List</h1>
            <h1 className=" mt-2 px-4 font-semibold uppercase">
              Пользователь:{' '}
              <span className="ml-1 normal-case">
                {loading ? 'looading....' : !user ? 'Не найден' : user.email}
              </span>
            </h1>
            <div className=" flex flex-col mt-4">
              <div className="flex items-center px-6 gap-4 flex-col">
                <div className=" bg-[#ec70ec9a] px-3 py-[6px] rounded-lg w-[180px]">
                  <input
                    className="w-[150px] truncate"
                    type="text"
                    onChange={e => setInputValue({ ...inputValue, email: e.target.value })}
                    placeholder="введите e-mail"
                    value={inputValue.email}
                  />
                </div>
                <div className="bg-[#ec70ec9a]  px-3 py-[6px] rounded-lg w-[180px]">
                  <input
                    className="w-[150px] truncate"
                    type="password"
                    onChange={e => setInputValue({ ...inputValue, password: e.target.value })}
                    placeholder="Введите пороль"
                    value={inputValue.password}
                  />
                </div>
              </div>
            </div>
            <div className=" mt-5 flex justify-between px-8 items-center">
              {user ? (
                <button
                  onClick={exitUser}
                  className=" rounded-lg px-8 hover:bg-[#c55b55c8] transition duration-150 py-2 bg-[#bd3737b2]">
                  Выйти
                </button>
              ) : (
                <button
                  onClick={signInWitEmail}
                  className=" rounded-lg px-8 hover:bg-[#64966fc8] transition duration-150 py-2 bg-[#8a55a6b2]">
                  Войти
                </button>
              )}
              <button
                onClick={LoginEmail}
                className="rounded-lg px-2 hover:bg-[#535497c8] transition duration-150 py-2 bg-[#8a55a6b2]">
                Зарегестрироваться
              </button>
            </div>
            {user ? (
              <div className="flex w-full justify-center items-center">
                <div
                  style={{ border: '0.02px solid white' }}
                  className=" flex items-center justify-between mt-5 cursor-pointer bg-[#824a97c8] px-6 py-2 rounded-lg ">
                  <input type="text" {...value} placeholder="Добавить дело" />
                  <Plus
                    onClick={addDelo}
                    className=" w-[22px] transition duration-150 hover:text-[#66ff4be2] "
                  />
                </div>
              </div>
            ) : !loading ? (
              <div className=" mt-4  flex justify-center">
                <h1 className=" uppercase text-[red] text-[24px]">Авторизуйтесь</h1>
              </div>
            ) : (
              <div className="flex mt-3  justify-center">
                <h1 className="mt-3 uppercase text-[22px]">looading...</h1>
              </div>
            )}
            <ul className="flex flex-col items-center gap-6 h-[400px] overflow-auto mt-10">
              {post.length ? (
                post.map((el, index) => {
                  const isdTrue =
                    'bg-[#5fcf40be] hover:bg-[red] transition duration-150  flex items-center justify-center rounded-md px-2 py-2';
                  const isdFalse =
                    'bg-[#d74343c8] hover:bg-[green] transition duration-150  flex items-center justify-center rounded-md px-2 py-2';
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between cursor-pointer bg-[#7b7180b5] py-3 px-5 rounded-xl w-[85%]">
                      <div onClick={() => dsdsdv(el)} className={el.did ? isdTrue : isdFalse}>
                        {<Check className=" w-[15px]" />}
                      </div>
                      <h1 className={!el.did ? 'w-[360px]' : 'w-[360px] line-through'}>
                        {el.value}
                      </h1>
                      <Trash2
                        onClick={() => deletePost(el)}
                        className="hover:text-[red] transition duration-150 "
                      />
                    </li>
                  );
                })
              ) : user ? (
                <div className="">
                  <h2 className=" uppercase text-center font-semibold text-[24px] text-[#b14c4c]">
                    Задач нету
                  </h2>
                  <h1 className="uppercase font-bold text-[28px] text-[#fa4848]">
                    Добавьте задачу
                  </h1>
                  <div className=" mt-5 flex justify-center">
                    <ArrowUpFromDot className=" w-[40px] cursor-pointer text-[red]" />
                  </div>
                </div>
              ) : null}
            </ul>{' '}
          </>
        ) : (
          <div className="flex justify-center">
            <h1 className=" uppercase text-2xl text-red-500">Ошибка при получение данных</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
