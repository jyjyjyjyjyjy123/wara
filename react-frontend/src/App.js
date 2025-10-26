import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import { PostDetailProvider } from "./context/PostDetailContext";
import { WriteProvider } from "./context/WriteContext";

// Layout & Routes
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PcOverlay from "./components/PcOverlay"; // PC 오버레이

// Pages
import Main from "./pages/Main";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import MyPosts from "./pages/mypage/MyPosts";
import MyInfo from "./pages/mypage/MyInfo";
import MyComments from "./pages/mypage/MyComments";
import MyLikes from "./pages/mypage/MyLikes";
import MyFavorites from "./pages/mypage/MyFavorites";
import Board from "./pages/Board";
import PostDetail from "./pages/PostDetail";
import Write from "./pages/Write";
import DateMap from "./pages/DateMap";

// Style
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <div className="app-bg">
            {/* PC 화면에서만 보이는 왼쪽 오버레이 */}
            <PcOverlay />

            {/* 모바일 컨텐츠 */}
            <div className="app-container">
              <Layout>
                <Routes>
                  {/* 기본 페이지 */}
                  <Route path="/" element={<Main />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/board" element={<Board />} />
                  <Route path="/datemap" element={<DateMap />} />

                  {/* 게시글 관련 */}
                  <Route
                    path="/posts/:postSeq"
                    element={
                      <PostDetailProvider>
                        <PostDetail />
                      </PostDetailProvider>
                    }
                  />
                  <Route
                    path="/posts/write"
                    element={
                      <ProtectedRoute>
                        <WriteProvider>
                          <Write editMode={false} />
                        </WriteProvider>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/posts/:postSeq/edit"
                    element={
                      <ProtectedRoute>
                        <WriteProvider>
                          <Write editMode={true} />
                        </WriteProvider>
                      </ProtectedRoute>
                    }
                  />

                  {/* 마이페이지 관련 */}
                  <Route
                    path="/mypage"
                    element={
                      <ProtectedRoute>
                        <MyPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mypage/myinfo"
                    element={
                      <ProtectedRoute>
                        <MyInfo />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mypage/myposts"
                    element={
                      <ProtectedRoute>
                        <MyPosts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mypage/mycomments"
                    element={
                      <ProtectedRoute>
                        <MyComments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mypage/myfavorites"
                    element={
                      <ProtectedRoute>
                        <MyFavorites />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mypage/mylikes"
                    element={
                      <ProtectedRoute>
                        <MyLikes />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
            </div>
          </div>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
