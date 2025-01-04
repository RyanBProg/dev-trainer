import RootLayoutWrapper from "../components/RootLayoutWrapper";

export default function About() {
  return (
    <RootLayoutWrapper>
      {/* White Space */}
      <div role="presentation" className="h-20 lg:h-28"></div>

      <section className="container mx-auto px-5 sm:px-10">
        {/* Introduction Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold">About Us</h1>
          <p className="mt-4 text-lg text-gray-500">
            Empowering businesses with innovative solutions.
          </p>
        </div>

        {/* Mission and Values Section */}
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl font-bold">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600">
              At [Your SaaS Product Name], our mission is to simplify workflows
              and empower businesses with tools that drive efficiency and
              growth. We’re committed to providing cutting-edge solutions that
              help teams achieve their goals faster and smarter.
            </p>
          </div>
          <div>
            <img
              src="https://via.placeholder.com/600x400"
              alt="Our Mission"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold">Why Choose Us</h2>
          <p className="mt-4 text-lg text-gray-600">
            We stand out because of our unique features:
          </p>
          <div className="grid gap-6 mt-10 lg:grid-cols-3">
            <div className="card bg-base-300 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl">Ease of Use</h3>
                <p>
                  Our intuitive interface ensures a seamless experience for all
                  users.
                </p>
              </div>
            </div>
            <div className="card bg-base-300 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl">Advanced Analytics</h3>
                <p>
                  Gain actionable insights and make data-driven decisions with
                  our powerful tools.
                </p>
              </div>
            </div>
            <div className="card bg-base-300 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl">Scalability</h3>
                <p>
                  Designed to grow with your business, no matter the size of
                  your team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <h2 className="text-center text-4xl font-bold mb-10">
            Meet the Team
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="card bg-base-100 shadow-lg">
              <figure>
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                  className="rounded-full w-32 mx-auto mt-6"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">John Doe</h3>
                <p>CEO & Founder</p>
                <p className="text-gray-600 text-sm">
                  Passionate about innovation and leadership.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg">
              <figure>
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                  className="rounded-full w-32 mx-auto mt-6"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Jane Smith</h3>
                <p>CTO</p>
                <p className="text-gray-600 text-sm">
                  Building scalable and reliable systems.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg">
              <figure>
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                  className="rounded-full w-32 mx-auto mt-6"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Emily Johnson</h3>
                <p>Head of Design</p>
                <p className="text-gray-600 text-sm">
                  Crafting beautiful and user-friendly designs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* White Space */}
      <div role="presentation" className="h-36 lg:h-48"></div>
    </RootLayoutWrapper>
  );
}
