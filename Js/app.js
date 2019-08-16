new Vue( {
    el: '#app',
    data: {
        keyword: '',
        isTrue: false,
        movieList: '',
        filterLlst: {},
        fullInfo: {
            "adult": false,
            "backdrop_path": "/1TFEtFxD1M9OvMGlGcSAR5Pg53I.jpg",
            "belongs_to_collection": {
                "id": 163902,
                "name": "RED Collection",
                "poster_path": "/d9T3DkXxDahif4eXPzrH28yayaL.jpg",
                "backdrop_path": "/7OsWpRJowfXdZ610iKiBA7FzaD6.jpg"
            },
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
            "homepage": null,
            "id": 39514,
            "imdb_id": "tt1245526",
            "original_language": "en",
            "original_title": "RED",
            "overview": "When his peaceful life is threatened by a high-tech assassin, former black-ops agent, Frank Moses reassembles his old team in a last ditch effort to survive and uncover his assailants.",
            "popularity": 14.003,
            "poster_path": "/q2mwTRKrq1etP9S4SZVDIJq0wI2.jpg",
            "production_companies": [ {
                "id": 491,
                "logo_path": "/rUp0lLKa1pr4UsPm8fgzmnNGxtq.png",
                "name": "Summit Entertainment",
                "origin_country": "US"
            }, {
                "id": 435,
                "logo_path": "/AjzK0s2w1GtLfR4hqCjVSYi0Sr8.png",
                "name": "Di Bonaventura Pictures",
                "origin_country": "US"
            }, {
                "id": 429,
                "logo_path": "/2Tc1P3Ac8M479naPp1kYT3izLS5.png",
                "name": "DC Comics",
                "origin_country": "US"
            } ],
            "production_countries": [ {
                "iso_3166_1": "US",
                "name": "United States of America"
            } ],
            "release_date": "2010-10-13",
            "revenue": 71664962,
            "runtime": 111,
            "spoken_languages": [ {
                "iso_639_1": "en",
                "name": "English"
            }, {
                "iso_639_1": "ru",
                "name": "Pусский"
            } ],
            "status": "Released",
            "tagline": "Still armed. Still dangerous. Still got it.",
            "title": "RED",
            "video": false,
            "vote_average": 6.6,
            "vote_count": 4238
        },
        ganre: '',
        poster: '',
        bg: {
            backgroundImage: '',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
        },
        imgHead: 'https://image.tmdb.org/t/p/original',
        currentItem: 0
    },
    methods: {
        //? Select movie from searchlist by index.
        //? Clear input on selection
        getMovie( index ) {
            this.filterLlst = this.movieList[ index ];
            this.isTrue = false;
        },
        nextItem() {
            if ( event.keyCode == 38 && this.currentItem > 0 ) {
                this.currentItem--
            } else if ( event.keyCode == 40 && this.currentItem < this.movieList.length ) {
                this.currentItem++;
            }
        },
        movieEnter() {
            if ( this.keyword != '' ) {
                this.filterLlst = this.movieList[ this.currentItem ];
                this.isTrue = false;
            }
        },
        itemIndex( index ) {
            this.currentItem = index;
        }
    },
    watch: {

        keyword: function () {
            //! Get movies json by search keyword to get movie ID
            var url = 'https://api.themoviedb.org/3/search/movie?api_key={da4d11234eb9fbd69aa0dd7c6323eff9}&query=' + this.keyword;
            fetch( url )
                .then( ( result ) => {
                    return result.json();
                } )
                .then( ( data ) => {
                    this.movieList = data.results;
                } );

            //?  display/hide search list 
            if ( this.movieList != '' ) {
                this.isTrue = true;
            } else {
                this.isTrue = false;
            }
        },

        filterLlst: function () {
            //! Fetch full imovie info  with move ID
            const urlId = 'https://api.themoviedb.org/3/movie/' + this.filterLlst.id + '?api_key=da4d11234eb9fbd69aa0dd7c6323eff9'
            fetch( urlId )
                .then( ( result ) => {
                    return result.json();
                } )
                .then( ( data ) => {
                    this.fullInfo = data;
                } );
        },
        fullInfo: function () {
            //? Generate link for poster
            if ( this.fullInfo.poster_path != null ) {
                this.poster = this.imgHead + this.fullInfo.poster_path;
            } else {
                this.poster = 'img/404PosterNotFound.jpg';
            }

            //? Generate link for background
            if ( this.fullInfo.backdrop_path != null ) {
                this.bg.backgroundImage = 'url(' + this.imgHead + this.fullInfo.backdrop_path + ')';
            } else {
                this.bg.backgroundImage = 'url(img/404bgNotFound.jpg)';
            }
        }
    },
    computed: { 
        //? filter list for movie title
        filteredList: function () {
            return this.movieList.filter( list => {
                return list.title.toLowerCase().includes( this.keyword.toLowerCase() );
            } )
        },

        //todo   Get first to types of genre if avilable alse output message
        getGenres: function () {
            if ( this.fullInfo.genres.length > 0 ) {
                return this.fullInfo.genres[ 0 ].name;
            } else {
                return "No info"
            }
        },
        //todo   Get runtime if avilable alse output message
        getRunTime() {
            if ( this.fullInfo.runtime != 0 ) {
                return this.fullInfo.runtime + " minutes";
            } else {
                return 'no data'
            }
        },
        //todo   Get budget if avilable alse output message
        getBoxoffice() {
            if ( this.fullInfo.budget != 0 ) {
                return this.fullInfo.budget;
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

        //* custom event on arrow up/down keys
        document.addEventListener( "keyup", this.nextItem );
    }
}, )