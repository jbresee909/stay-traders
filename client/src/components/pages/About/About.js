import React from 'react'
import './About.css'

const About = () => {
    return (
        <div className="container mt-3">
            <h1 style={{ textAlign: "center" }} className="mb-4">How Stay Traders Works</h1>
            <div className="about-section">
                <div>
                    <h4>Browse.</h4>
                    <p>Search through listings posted by other users. If you see something you like, then hit the green like button. If they like one of your properties, then
                        you will be notified.
                    </p>
                </div>
                <img src="https://res.cloudinary.com/justin-bresee/image/upload/v1642716269/StayTraders/browse_eae25q.png" />
            </div>
            <div className="about-section">
                <img src="https://res.cloudinary.com/justin-bresee/image/upload/v1642717073/StayTraders/messaging_aqefud.png" />
                <div>
                    <h4>Message.</h4>
                    <p>Once a match has been made, you will have the option to start a conversation with the other user on the Stay Traders platform. You can message
                        in order to find dates that work for both of you to trade your properties. The idea is to trade for a short period of time (a few days or weeks)
                        so you can each have a chance to vacation in a new place without needing to pay anything!
                    </p>
                </div>
            </div>
            <div className="about-section">
                <div>
                    <h4>Trade!</h4>
                    <p>
                        When the first day of your trade arrives, you can make the swap and vacation at each other's property!
                    </p>
                </div>
                <img src="https://res.cloudinary.com/justin-bresee/image/upload/v1642717207/StayTraders/vacation-house_bcoeon.jpg" />
            </div>
        </div>
    )
}

export default About;