//! Vue template for rating calculation
Vue.component("star-rating", VueStarRating.default);
Vue.use(VueResource);

new Vue({
  el: "#app",
  data: {
    keyword: "",
    show: true,
    isTrue: false,
    movieList: [],
    filterList: {},
    fullInfo: {
      backdrop_path: "/3qAM6vvbf6RXR9pLL9yUwHvhEA3.jpg",
      budget: 58000000,
      genres: [
        {
          id: 18,
          name: "Drama"
        },
        {
          id: 28,
          name: "Action"
        },
        {
          id: 12,
          name: "Adventure"
        },
        {
          id: 36,
          name: "History"
        },
        {
          id: 10752,
          name: "War"
        }
      ],
      homepage: "http://www.redtails2012.com/",
      id: 72431,
      imdb_id: "tt0485985",
      original_language: "en",
      original_title: "Red Tails",
      overview:
        "The story of the Tuskegee Airmen, the first African-American pilots to fly in a combat squadron during World War II.",
      popularity: 6.904,
      poster_path: "/Atq5js5fbsu5EXubZRizWaSXoBJ.jpg",
      release_date: "2012-01-19",
      revenue: 50365377,
      runtime: 125,
      status: "Released",
      tagline: "High-Octane Action and Daring Dogfights!",
      title: "Red Tails",
      video: false,
      vote_average: 6,
      vote_count: 260
    },
    poster: "",
    bg: {
      backgroundImage: "",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    },
    imgHead: "https://image.tmdb.org/t/p/original",
    currentItem: 0
  },
  methods: {
    //! Select movie from randered list by index,
    //! Save info in filterList
    //! Clear input
    getMovie(index) {
      this.filterList = this.movieList[index];
      this.isTrue = false;
      this.keyword = "";
    },

    //! Navitage between randered list by Up/Down keys
    nextItem() {
      if (event.keyCode == 38 && this.currentItem > 0) {
        this.currentItem--;
      } else if (
        event.keyCode == 40 &&
        this.currentItem < this.movieList.length
      ) {
        this.currentItem++;
      }
    },

    //! Selection of selected movie on key Enter.
    //! Set isTrue to false to hide list block after selection
    //! Clear input
    movieEnter() {
      this.filterList = this.movieList[this.currentItem];
      this.isTrue = false;
      this.keyword = "";
    },

    //! Get movie from rendered list by index on click
    itemIndex(index) {
      this.currentItem = index;
    }
  },

  watch: {
    //! watch input changes
    keyword: function() {
      //! Get movies, Json  format by search keyword
      if (this.keyword != "") {
        this.$http
          .get(
            `https://api.themoviedb.org/3/search/movie?api_key=ad37adf30760fa22b0f9a4e01354dd8a&query=${this.keyword}`
          )
          .then(Response => {
            return Response.json();
          })
          .then(data => {
            this.movieList = data.results;
          });
      }

      //!  display/hide search list
      if (this.keyword != "") {
        this.isTrue = true;
      } else {
        this.isTrue = false;
      }
    },
    //! Fetch full imovie info with move ID
    filterList: function() {
      console.log(this.filterList);
      console.log(this.filterList.id);
      this.$http
        .get(
          `https://api.themoviedb.org/3/movie/${this.filterList.id}?api_key=ad37adf30760fa22b0f9a4e01354dd8a`
        )
        .then(Response => {
          return Response.json();
        })
        .then(data => {
          this.fullInfo = data;
          console.log(data);
        });
    },

    fullInfo: function() {
      //! Generate link for poster
      if (this.fullInfo.poster_path != null) {
        this.poster = this.imgHead + this.fullInfo.poster_path;
      } else {
        this.poster = "img/404PosterNotFound.jpg";
      }

      //! Generate link for background
      if (this.fullInfo.backdrop_path != null) {
        this.bg.backgroundImage =
          "url(" + this.imgHead + this.fullInfo.backdrop_path + ")";
      } else {
        this.bg.backgroundImage = "url(img/404bgNotFound.jpg)";
      }
    }
  },
  computed: {
    //! filter list for movie by title search,
    //! when movieList is not "Undefined"
    filteredList() {
      if (this.movieList != undefined) {
        return this.movieList.filter(element => {
          return element.title
            .toLowerCase()
            .includes(this.keyword.toLowerCase());
        });
      }
    },
    //todo   Get runtime if avilable alse output message
    getRunTime() {
      if (this.fullInfo.runtime != 0 && this.fullInfo.runtime != null) {
        return this.fullInfo.runtime + " minutes";
      } else {
        return "no data";
      }
    },

    //todo   Get budget if avilable alse output message
    getBoxoffice() {
      if (this.fullInfo.budget != 0) {
        return "$ " + this.fullInfo.budget;
      } else {
        return "no data";
      }
    },
    //todo   Get raiting if avilable alse output message
    getRating() {
      if (this.fullInfo.vote_average != 0) {
        return this.fullInfo.vote_average;
      } else {
        return "no data";
      }
    }
  },

  //? generate poster/bg on load
  created() {
    this.poster = this.imgHead + this.fullInfo.poster_path;
    this.bg.backgroundImage =
      "url(" + this.imgHead + this.fullInfo.backdrop_path;
    +")";

    //! custom event on arrow up/down keys
    document.addEventListener("keyup", this.nextItem);
  }
});
