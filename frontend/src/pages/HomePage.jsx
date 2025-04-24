import { Bookmark, BookmarkCheck, Search, Volume2, VolumeOff, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuthStore } from '../stores/useAuthStore';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWordEntryStore } from '../stores/useWordEntryStore';

const HomePage = () => {

  const [speakFlag, setSpeakFlag] = useState(false);
  const [bookmarkFlag, setBookmarkFlag] = useState(false);

  const handleBookmark = async () => {
    try {

      setBookmarkFlag(!bookmarkFlag);

      console.log("word :", wordEntry, " token: ", token )

      const res = await axios.post("https://localhost:3000/api/word/bookmark", { wordId: wordEntry._id }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(res);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }

  };


  const handleSpeakOut = () => {
    if (!word.trim()) return;

    if (!speakFlag) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';

      utterance.onend = () => setSpeakFlag(false);
      utterance.onerror = () => setSpeakFlag(false);

      setSpeakFlag(true);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
      setSpeakFlag(false);
    }
  };


  const { token } = useAuthStore();
  const { wordEntry, setWordEntry, clearWordEntry } = useWordEntryStore();

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const [word, setWord] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!word) {
      clearWordEntry();
      setBookmarkFlag(false);
      setLoading(false);
    }
  }, [clearWordEntry, word]);

  const getResult = async () => {

    if (!token) return alert("Please login to access searching");
    if (!word.trim()) return alert("Please enter a word to search");

    try {
      setLoading(true);
      setWordEntry(null);

      const res = await axios.post(
        "http://localhost:3000/api/word/define",
        { word },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setBookmarkFlag(res.data.data.isBookmarked || false);
      setWordEntry(res.data.data);

    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className='min-h-[68vh] overflow-x-hidden'>

      <div className='w-full flex items-center justify-center flex-col gap-5 py-10'>
        <p className='text-center text-lg'>AI-Powered Dictionary for Instant Definitions and Translations</p>
        <div className='w-1/3 border-2 border-[#d4c9bed6]  focus:border-[#F1EFEC] px-5 flex items-center rounded-md'>
          <input aria-label="Search word" type="text" placeholder='Search a word' onKeyUp={(e) => { if (e.key === "Enter") { getResult(); } }} className='w-full py-3 capitalize focus:outline-none' value={word} onChange={e => setWord(e.target.value)} />
          {word.length != 0 && <X className='cursor-pointer mx-2' onClick={() => setWord("")} />}
          <Search className='cursor-pointer mx-2' onClick={() => getResult()} />
        </div>
      </div>

      {
        word &&
        <div className=' min-h-[40vh] flex items-center justify-center py-6 w-full '>
          <div className='w-1/2 mx-auto'>
            {loading ?
              <ClipLoader
                color={"white"}
                loading={loading}
                cssOverride={override}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              : wordEntry != null ? (
                <div className=" markdown-content">
                  <div className='flex gap-2 items-center mb-8'>
                    <button onClick={handleSpeakOut} className={` ${!speakFlag ? "bg-pink-400" : "bg-red-500"}  px-4 py-2 text-black rounded-md cursor-pointer`}> {!speakFlag ? <Volume2 size={20} /> : <VolumeOff size={20} />} </button>
                    <button onClick={handleBookmark} className={`${bookmarkFlag ? "bg-blue-400" : "bg-pink-400"}  font-semibold text-sm cursor-pointer text-zinc-900 px-6 py-2 rounded-md flex gap-1 items-center`}>  {bookmarkFlag ? <> <BookmarkCheck size={18} /> Bookmarked </> : <> <Bookmark size={18} /> Bookmark </>} </button>
                  </div>
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {wordEntry?.definition}
                  </Markdown>
                </div>
              ) : (
                <p className="text-center text-zinc-600">Click "Enter" or Search button to search</p>
              )}
          </div>
        </div>
      }

      {!word &&
        <div className='w-full min-h-[40vh] flex items-center justify-center'>
          <p className='text-zinc-600'>  {token ? "Start typing to search..." : <span> Kindly <Link to="/login" className='border-b hover:text-[#FFFAEC] transition-colors ease-in duration-300 '>Login</Link> to Access Searching </span>} </p>
        </div>
      }

    </div>
  )
}

export default HomePage