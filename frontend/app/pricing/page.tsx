import RootLayoutWrapper from "../components/RootLayoutWrapper";

export default function Pricing() {
  return (
    <RootLayoutWrapper>
      {/* White Space */}
      <div role="presentation" className="h-20 lg:h-28"></div>

      <section className="container mx-auto px-5 sm:px-10">
        <div>
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold">Our Pricing</h2>
            <p className="mt-4 text-lg text-gray-500">
              Flexible plans to suit every need.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="card bg-base-300 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl">Free</h3>
                <p>Perfect for individuals exploring our service.</p>
                <h4 className="text-4xl font-bold mt-4">$0</h4>
                <p className="text-sm text-gray-500">per month</p>
                <ul className="mt-4 space-y-2">
                  <li>&#10003; Basic features</li>
                  <li>&#10003; Community support</li>
                  <li>&#10003; Up to 5 projects</li>
                </ul>
                <div className="card-actions justify-center mt-6">
                  <button className="btn btn-info">Get Started</button>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="card bg-accent text-primary-content shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl">Pro</h3>
                <p>Best for small teams and professionals.</p>
                <h4 className="text-4xl font-bold mt-4">$19</h4>
                <p className="text-sm text-gray-200">per month</p>
                <ul className="mt-4 space-y-2">
                  <li>&#10003; Everything in Free</li>
                  <li>&#10003; Premium support</li>
                  <li>&#10003; Unlimited projects</li>
                  <li>&#10003; Advanced analytics</li>
                </ul>
                <div className="card-actions justify-center mt-6">
                  <button className="btn btn-active">Get Pro</button>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="card bg-base-300 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl">Enterprise</h3>
                <p>For large organizations and advanced needs.</p>
                <h4 className="text-4xl font-bold mt-4">$49</h4>
                <p className="text-sm text-gray-500">per month</p>
                <ul className="mt-4 space-y-2">
                  <li>&#10003; Everything in Pro</li>
                  <li>&#10003; Dedicated account manager</li>
                  <li>&#10003; Custom integrations</li>
                  <li>&#10003; 24/7 priority support</li>
                </ul>
                <div className="card-actions justify-center mt-6">
                  <button className="btn btn-info">Contact Us</button>
                </div>
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
