export default function page() {
    return (
        <div className="login-page">
        <span className="top-shape"></span>
        <span className="bottom-shape"></span>
        <div className="hero min-h-screen">
        <div className="hero-content flex-col">
          <div className="text-center lg:text-center">
          
           
  <div className="w-60">
    <img src="./images/logo.png" />
  </div>
          </div>
          <div className="card flex-shrink-0 w-96 max-w-sm shadow-2xl bg-yellow-400">
            <form className="card-body">
              <div className="form-control">
              
                <input type="email" placeholder="Email" className="input input-bordered text-center" required />
              </div>
              <div className="form-control">
               
                <input type="password" placeholder="Password" className="input input-bordered text-center" required />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    )
};
