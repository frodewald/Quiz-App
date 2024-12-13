import React from 'react';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loading-icons';

const UserWidget = ({
  isAuthenticated,
  userData,
  updateUser,
  setUpdateUser,
  updateUsername,
  setUpdateUsername,
  isUpdateUserSuccess,
  isLogoutSuccess,
  updateUsernameError,
  handleFormUpdateUser,
  updateUserDataToDB,
  loadingUpdateUser,
  logout
}) => {
  return (
    <>
      {isAuthenticated ? (
        <div>
          <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={handleFormUpdateUser}>
            <img
              src={userData?.picture ? userData.picture : 'https://avatar.iran.liara.run/public'}
              alt="img"
              width={40}
              className="me-2 rounded-circle"
              referrerPolicy="no-referrer"
            />
            <p className="m-0 custom-text">{userData?.name}</p>
          </div>
          {updateUser && (
            <div className="bg-white shadow p-3 rounded-3 mt-2" style={{ width: '100%', maxWidth: '300px' }}>
              <form onSubmit={updateUserDataToDB}>
                <div className="mb-3">
                  <label htmlFor="updateUsername" className="form-label p-1">
                    Update Name
                    {isUpdateUserSuccess && (
                      <span className="text-success px-2 fw-bold rounded-2 d-inline-block fade-in-animation">
                        Success!
                      </span>
                    )}
                    {isLogoutSuccess && (
                      <span className="text-danger px-2 fw-bold rounded-2 d-inline-block fade-in-animation">
                        Logout!
                      </span>
                    )}
                    {updateUsernameError && (
                      <span className="text-danger px-2 fw-bold rounded-2 d-inline-block fade-in-animation">
                        {updateUsernameError}
                      </span>
                    )}
                    {loadingUpdateUser && (
                      <span className='px-2'>
                        <ThreeDots fill='black' height="20px" width="20px" strokeWidth={3}/>
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="updateUsername"
                    className="form-control"
                    placeholder="Enter new username"
                    value={updateUsername}
                    onChange={(e) => setUpdateUsername(e.target.value)}
                    required
                  />
                </div>
                <button type='submit' className="btn btn-primary mb-1 d-block my-0 mx-auto w-100">Update</button>
              </form>
              <button className="btn btn-danger d-block my-0 mx-auto w-100" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </>
  );
};

export default UserWidget;
