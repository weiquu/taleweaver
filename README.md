<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/taleweaverapp/taleweaver">
    <img style="margin: 2rem" src="/frontend/src/images/taleweaver_logo_color_light.svg" alt="TaleWeaver Logo" width="300" height="100">
  </a>

  <p align="center">
    Millions of Customisable, Safe Storybooks
    <br />
    <br />
    <a href="https://taleweaver.net/">View Demo</a>
    ·
    <a href="https://github.com/taleweaverapp/taleweaver/issues">Report Bug</a>
    ·
    <a href="https://github.com/taleweaverapp/taleweaver/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Our application, TaleWeaver, is a web application that offers parents with young children the ability to create customised illustrated stories for their child. In addition to setting various parameters such as what the story is about, what values it should impart, etc, parents can also personalise the story to their child. They do so by creating an avatar that resembles their child and using that as the main character in the story. TaleWeaver thus offers a convenient and time-efficient means for parents to provide personalised storytelling experiences, not only alleviating the frustration of repetitive and hard-to-find books but also fostering engagement through the child’s inclusion as the main character. It stands out as a superior alternative to mindless screen time, encouraging children to explore imaginative worlds through personalised stories and illustrations while also enabling parents to instil moral values, ensuring that the time children spend with TaleWeaver is not just entertaining but also enriching.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contributions

### A3

Joshen Lim - A0214525M

- Branding of TaleWeaver
- Frontend development of landing page, assets, UI, book display
- Development of authentication and authentication provider

Neo Wei Qing - A0217395X

- Database design and setup
- Implement backend APIs to connect with database storage and LLM
- Integrate frontend with backend APIs
- Frontend development of library
- Hosting and deployment

Jivesh Mohan - A0221768Y

- Development of authentication
- Improvement of signup validation
- Implement Google analytics
- Frontend development of authentication provider

Lau Zhan Ming - A0236552E

- Prompt refinement, prompt engineering
- Frontend development of libraries
- Integration frontend with backend servers
- Full stack development of libraries

### Final Project

Joshen Lim - A0214525M

- Product management, delegation of work and prioritisation of tasks
- Implementation of branding and ensuring consistency throughout website
- Mobile-responsive development for stories, landing page, and ‘Create Story’ pages
- Create Avatar feature, Stripe payment integration, migration to SDXL API, credits and subscription logic and display
- STePS video

Jivesh Mohan - A0221768Y

- Routing of individual stories to unique URLs, only displaying public stories to users
- Integration of Authentication, Google Auth, email client setup
- Implementation of notification UI for successful/failed story generation
- Improve UX of ‘Create Story’ page

Neo Wei Qing - A0217395X

- Spearheaded triaging of deployment options, and handling of deployment versions
- Developed the Likes feature, sorting of results, integration of avatar descriptors into story
- Implemented logging of story generation details (total count, success, failures) for better
- Improved visual display of user’s subscription details, and provide better UX options when users run out of credits

Quan Teng Foong - A0223929X

- Improved Random Story feature to be independent of GPT API calls
- Spearheaded Job Queue backend logic to allow background generation of stories
- Developed display for failed generations and allow user to recreate using saved customisation options
- Integrated Tanstack React Query to cache fetched stories, significantly reducing egress amounts
- Parallelised generation of images

Justin Lim - A0216138J

- Creation and execution of branding identity and assets
- UI prototyping and research
- UX research and reporting
- Marketing Strategy
- STEPS marketing collaterals (standee, posters, namecards, stickers)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][React.js]][React-url]
- [![Chakra UI][Chakra-ui]][Chakra-url]
- [![FastAPI][FastAPI]][FastAPI-url]
- [![OpenAI][OpenAI]][OpenAI-url]
- [![Supabase][Supabase-icon]][Supabase-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

All three processes (frontend, backend, storage) should be running at the same time.

1. Clone the repo
   ```sh
   git clone https://github.com/joshenx/taleweaver.git
   ```
2. Setup frontend on localhost:5173
   ```sh
   cd taleweaver/frontend
   yarn install
   yarn start
   ```
3. Setup backend on localhost:8000 (default)
   ```sh
   cd taleweaver/genapi
   pip install -r requirements.txt
   uvicorn src.main:app --reload
   ```
4. Setup storage on localhost:8080
   ```sh
   cd taleweaver/storage
   pip install -r requirements.txt
   uvicorn src.main:app --port 8080 --reload
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Add main features
- [x] Add readme
- [x] Improve image generation
- [x] Make stories sharable

See the [open issues](https://github.com/taleweaverapp/taleweaver/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [ChatGPT](https://chat.openai.com/)
- [Authentication in React with Supabase](https://blog.openreplay.com/authentication-in-react-with-supabase/)
- [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
- [Malven's Grid Cheatsheet](https://grid.malven.co/)
- [Img Shields](https://shields.io)
- [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Chakra-ui]: https://shields.io/badge/chakra--ui-black?logo=chakraui&style=for-the-badge
[Chakra-url]: https://chakra-ui.com/
[FastAPI]: https://img.shields.io/badge/FastAPI-black?style=for-the-badge&logo=fastapi
[FastAPI-url]: https://fastapi.tiangolo.com/
[Supabase-icon]: https://shields.io/badge/supabase-black?logo=supabase&style=for-the-badge
[Supabase-url]: https://supabase.com/
[OpenAI]: https://shields.io/badge/OpenAI-black?logo=openai&style=for-the-badge
[OpenAI-url]: https://openai.com/
