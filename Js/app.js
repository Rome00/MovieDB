new Vue( {
    el: '#app',
    data: {
        keyword: '',
        show: true,
        isTrue: false,
        movieList: [],
        filterList: {},
        fullInfo: {
            "backdrop_path": "/1TFEtFxD1M9OvMGlGcSAR5Pg53I.jpg",
            "budget": 58000000,
            "genres": [ {
                "id": 28,
                "name": "Action"
            }, {
                "id": 12,
                "name": "Adventure"
            }, {
                "id": 35,
                "name": "Comedy"
            }, {
                "id": 80,
                "name": "Crime"
            }, {
                "id": 53,
                "name": "Thriller"
            } ],
            "id": 39514,
            "original_title": "RED",
            "overview": "When his peaceful life is threatened by a high-tech assassin, former black-ops agent, Frank Moses reassembles his old team in a last ditch effort to survive and uncover his assailants.",
            "popularity": 14.003,
            "poster_path": "/q2mwTRKrq1etP9S4SZVDIJq0wI2.jpg",
            "release_date": "2010-10-13",
            "revenue": 71664962,
            "runtime": 111,
            "status": "Released",
            "tagline": "Still armed. Still dangerous. Still got it.",
            "title": "RED",
            "video": false,
            "vote_average": 6.6,
            "vote_count": 4238
        },
        poster: '',
        bg: {
            backgroundImage: '',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
        },
        imgHead: 'https://image.tmdb.org/t/p/original',
        currentItem: 0,
        MovieGenre: []
    },
    methods: {
        //! Select movie from randered list by index,
        //! Save info in filterList
        //! Clear input
        getMovie( index ) {
            this.filterList = this.movieList[ index ];
            this.isTrue = false;
            this.keyword = ''
        },

        //! Navitage between randered list by Up/Down keys
        nextItem() {
            if ( event.keyCode == 38 && this.currentItem > 0 ) {
                this.currentItem--
            } else if ( event.keyCode == 40 && this.currentItem < this.movieList.length ) {
                this.currentItem++;
            }
        },

        //! Selection of selected movie on key Enter.
        //! Set isTrue to false to hide list block after selection
        //! Clear input
        movieEnter() {
            this.filterList = this.movieList[ this.currentItem ];
            this.isTrue = false;
            this.keyword = '';
        },

        //! Get movie by rendered list index on click
        itemIndex( index ) {
            this.currentItem = index;
        },
    },

    watch: {
        //! watch input changes
        keyword: function () {
            //! Get movies, Json  format by search keyword
            if ( this.keyword != '' ) {
                var url = 'https://api.themoviedb.org/3/search/movie?api_key={da4d11234eb9fbd69aa0dd7c6323eff9}&query=' + this.keyword;
                fetch( url )
                    .then( ( result ) => {
                        return result.json();
                    } )
                    .then( ( data ) => {
                        this.movieList = data.results;
                    } );
            }

            //!  display/hide search list 
            if ( this.keyword != '' ) {
                this.isTrue = true;
            } else {
                this.isTrue = false;
            }
        },
        //! Fetch full imovie info with move ID
        filterList: function () {
            const urlId = 'https://api.themoviedb.org/3/movie/' + this.filterList.id + '?api_key=da4d11234eb9fbd69aa0dd7c6323eff9'
            fetch( urlId )
                .then( ( result ) => {
                    return result.json();
                } )
                .then( ( data ) => {
                    this.fullInfo = data;
                } );
        },

        fullInfo: function () {

            //! Generate link for poster
            if ( this.fullInfo.poster_path != null ) {
                this.poster = this.imgHead + this.fullInfo.poster_path;
            } else {
                this.poster = 'img/404PosterNotFound.jpg';
            }

            //! Generate link for background
            if ( this.fullInfo.backdrop_path != null ) {
                this.bg.backgroundImage = 'url(' + this.imgHead + this.fullInfo.backdrop_path + ')';
            } else {
                this.bg.backgroundImage = 'url(img/404bgNotFound.jpg)';
            }
        }
    },
    computed: {
        //! filter list for movie by title search, 
        //! when movieList is not "Undefined"
        filteredList() {
            if ( this.movieList != undefined ) {
                return this.movieList.filter( list => {
                    return list.title.toLowerCase().includes( this.keyword.toLowerCase() );
                } )
            }
        },

        //todo   Get runtime if avilable alse output message
        getRunTime() {
            if ( this.fullInfo.runtime != 0 && this.fullInfo.runtime != null ) {
                return this.fullInfo.runtime + " minutes";
            } else {
                return 'no data'
            }
        },

        //todo   Get budget if avilable alse output message
        getBoxoffice() {
            if ( this.fullInfo.budget != 0 ) {
                return '$ ' + this.fullInfo.budget;
            } else {
                return 'no data'
            }
        },
        //todo   Get raiting if avilable alse output message
        getRating() {
            if ( this.fullInfo.vote_average != 0 ) {
                return this.fullInfo.vote_average;
            } else {
                return 'no data'
            }
        },
    },

    //? generate poster/bg on load
    created() {
        this.poster = this.imgHead + this.fullInfo.poster_path;
        this.bg.backgroundImage = 'url(' + this.imgHead + this.fullInfo.backdrop_path; + ')';

        //! custom event on arrow up/down keys
        document.addEventListener( "keyup", this.nextItem );
    }
}, )


const burger = document.querySelector( '.navbar-toggler' );

burger.addEventListener( 'click', () => {
    burger.classList.toggle( 'Burgeractive' );
} );