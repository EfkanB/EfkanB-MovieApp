package com.movieapp.backend;

import com.movieapp.backend.model.Content;
import com.movieapp.backend.model.Movie;
import com.movieapp.backend.model.Series;
import com.movieapp.backend.repository.ContentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(ContentRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // 15 Dünyaca Ünlü Film
                Movie movie1 = new Movie();
                movie1.setTitle("Inception");
                movie1.setDescription("Bir hırsız, rüya paylaşımı teknolojisi aracılığıyla kurumsal sırları çalan bir ekiple birlikte unutulmaz bir soygun gerçekleştirir. Gerçeklik ve rüya arasındaki sınırlar bulanıklaşır.");
                movie1.setGenre("Bilim Kurgu");
                movie1.setReleaseYear(2010);
                movie1.setPosterUrl("https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg");
                movie1.setDirector("Christopher Nolan");
                movie1.setDurationMinutes(148);
                repository.save(movie1);

                Movie movie2 = new Movie();
                movie2.setTitle("The Dark Knight");
                movie2.setDescription("Batman, Gotham şehrinde Joker ile karşı karşıya gelir. Kaos ve adalet arasındaki savaşta şehrin kaderi tehlikededir.");
                movie2.setGenre("Aksiyon");
                movie2.setReleaseYear(2008);
                movie2.setPosterUrl("https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg");
                movie2.setDirector("Christopher Nolan");
                movie2.setDurationMinutes(152);
                repository.save(movie2);

                Movie movie3 = new Movie();
                movie3.setTitle("Interstellar");
                movie3.setDescription("Bir grup kaşif, insanlığın geleceğini kurtarmak için bir solucan deliğinden geçerek uzaya yolculuk eder.");
                movie3.setGenre("Bilim Kurgu");
                movie3.setReleaseYear(2014);
                movie3.setPosterUrl("https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg");
                movie3.setDirector("Christopher Nolan");
                movie3.setDurationMinutes(169);
                repository.save(movie3);

                Movie movie4 = new Movie();
                movie4.setTitle("The Shawshank Redemption");
                movie4.setDescription("Haksız yere ömür boyu hapis cezasına çarptırılan Andy Dufresne, umudunu kaybetmeden özgürlüğü için savaşır.");
                movie4.setGenre("Dram");
                movie4.setReleaseYear(1994);
                movie4.setPosterUrl("https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg");
                movie4.setDirector("Frank Darabont");
                movie4.setDurationMinutes(142);
                repository.save(movie4);

                Movie movie5 = new Movie();
                movie5.setTitle("Pulp Fiction");
                movie5.setDescription("Los Angeles'ta geçen birbirine bağlı hikayeler, suç, şiddet ve beklenmedik olaylarla dolu bir labirent oluşturur.");
                movie5.setGenre("Suç");
                movie5.setReleaseYear(1994);
                movie5.setPosterUrl("https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg");
                movie5.setDirector("Quentin Tarantino");
                movie5.setDurationMinutes(154);
                repository.save(movie5);

                Movie movie6 = new Movie();
                movie6.setTitle("The Godfather");
                movie6.setDescription("Corleone ailesinin güçlü babası Vito'nun yerine geçen Michael, mafya dünyasının karanlık yüzüyle tanışır.");
                movie6.setGenre("Suç");
                movie6.setReleaseYear(1972);
                movie6.setPosterUrl("https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg");
                movie6.setDirector("Francis Ford Coppola");
                movie6.setDurationMinutes(175);
                repository.save(movie6);

                Movie movie7 = new Movie();
                movie7.setTitle("Forrest Gump");
                movie7.setDescription("Zekâ engelli Forrest Gump, Amerikan tarihinin önemli olaylarına tanıklık eder ve hayatının hikayesini anlatır.");
                movie7.setGenre("Dram");
                movie7.setReleaseYear(1994);
                movie7.setPosterUrl("https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg");
                movie7.setDirector("Robert Zemeckis");
                movie7.setDurationMinutes(142);
                repository.save(movie7);

                Movie movie8 = new Movie();
                movie8.setTitle("The Matrix");
                movie8.setDescription("Neo, gerçek dünyanın aslında bir simülasyon olduğunu keşfeder ve özgürleşme mücadelesine başlar.");
                movie8.setGenre("Bilim Kurgu");
                movie8.setReleaseYear(1999);
                movie8.setPosterUrl("https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg");
                movie8.setDirector("Lana Wachowski");
                movie8.setDurationMinutes(136);
                repository.save(movie8);

                Movie movie9 = new Movie();
                movie9.setTitle("Schindler's List");
                movie9.setDescription("II. Dünya Savaşı sırasında Oskar Schindler, Yahudi işçilerini kurtarmak için fabrikasını kullanır.");
                movie9.setGenre("Tarih");
                movie9.setReleaseYear(1993);
                movie9.setPosterUrl("https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg");
                movie9.setDirector("Steven Spielberg");
                movie9.setDurationMinutes(195);
                repository.save(movie9);

                Movie movie10 = new Movie();
                movie10.setTitle("Fight Club");
                movie10.setDescription("Bir adam, gizli bir dövüş kulübüne katılır ve hayatı altüst olur. Gerçeklik sorgulanır.");
                movie10.setGenre("Dram");
                movie10.setReleaseYear(1999);
                movie10.setPosterUrl("https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg");
                movie10.setDirector("David Fincher");
                movie10.setDurationMinutes(139);
                repository.save(movie10);

                Movie movie11 = new Movie();
                movie11.setTitle("The Lord of the Rings: The Fellowship of the Ring");
                movie11.setDescription("Frodo ve arkadaşları, güçlü yüzüğü yok etmek için tehlikeli bir yolculuğa çıkar.");
                movie11.setGenre("Fantastik");
                movie11.setReleaseYear(2001);
                movie11.setPosterUrl("https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg");
                movie11.setDirector("Peter Jackson");
                movie11.setDurationMinutes(178);
                repository.save(movie11);

                Movie movie12 = new Movie();
                movie12.setTitle("Star Wars: Episode IV - A New Hope");
                movie12.setDescription("Genç Luke Skywalker, Jedi olarak eğitim alır ve İmparatorluk'a karşı mücadeleye katılır.");
                movie12.setGenre("Bilim Kurgu");
                movie12.setReleaseYear(1977);
                movie12.setPosterUrl("https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg");
                movie12.setDirector("George Lucas");
                movie12.setDurationMinutes(121);
                repository.save(movie12);

                Movie movie13 = new Movie();
                movie13.setTitle("Titanic");
                movie13.setDescription("1912'de batan Titanic gemisinde yaşanan aşk hikayesi ve trajik olaylar.");
                movie13.setGenre("Romantik");
                movie13.setReleaseYear(1997);
                movie13.setPosterUrl("https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg");
                movie13.setDirector("James Cameron");
                movie13.setDurationMinutes(194);
                repository.save(movie13);

                Movie movie14 = new Movie();
                movie14.setTitle("Avatar");
                movie14.setDescription("Bir denizci, Pandora gezegeninde yaşayan Na'vi halkıyla bağlantı kurar ve gezegeni savunur.");
                movie14.setGenre("Bilim Kurgu");
                movie14.setReleaseYear(2009);
                movie14.setPosterUrl("https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg");
                movie14.setDirector("James Cameron");
                movie14.setDurationMinutes(162);
                repository.save(movie14);

                Movie movie15 = new Movie();
                movie15.setTitle("Gladiator");
                movie15.setDescription("Roma İmparatorluğu'nun generali Maximus, ailesinin katledilmesinden sonra intikam arayışına girer.");
                movie15.setGenre("Tarih");
                movie15.setReleaseYear(2000);
                movie15.setPosterUrl("https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg");
                movie15.setDirector("Ridley Scott");
                movie15.setDurationMinutes(155);
                repository.save(movie15);

                // 10 Popüler Dizi
                Series series1 = new Series();
                series1.setTitle("Breaking Bad");
                series1.setDescription("Kimya öğretmeni Walter White, kanser teşhisi sonrası metamfetamin üretmeye başlar ve suç dünyasına dalar.");
                series1.setGenre("Suç");
                series1.setReleaseYear(2008);
                series1.setPosterUrl("https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg");
                series1.setSeasonCount(5);
                series1.setEpisodeCount(62);
                repository.save(series1);

                Series series2 = new Series();
                series2.setTitle("Game of Thrones");
                series2.setDescription("Westeros kıtasında taht kavgaları, sihir ve ejderhalarla dolu destansı bir hikaye.");
                series2.setGenre("Fantastik");
                series2.setReleaseYear(2011);
                series2.setPosterUrl("https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg");
                series2.setSeasonCount(8);
                series2.setEpisodeCount(73);
                repository.save(series2);

                Series series3 = new Series();
                series3.setTitle("The Sopranos");
                series3.setDescription("Mafya lideri Tony Soprano'nun ailesi, işi ve psikolojik sorunlarıyla boğuşmasını konu alır.");
                series3.setGenre("Suç");
                series3.setReleaseYear(1999);
                series3.setPosterUrl("https://image.tmdb.org/t/p/w500/aRf8hCFEOXN7yOUzNvCRVuVd8xS.jpg");
                series3.setSeasonCount(6);
                series3.setEpisodeCount(86);
                repository.save(series3);

                Series series4 = new Series();
                series4.setTitle("Stranger Things");
                series4.setDescription("Hawkins kasabasında yaşanan gizemli olaylar, paralel boyut ve süper güçlere sahip çocuklar.");
                series4.setGenre("Bilim Kurgu");
                series4.setReleaseYear(2016);
                series4.setPosterUrl("https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg");
                series4.setSeasonCount(4);
                series4.setEpisodeCount(34);
                repository.save(series4);

                Series series5 = new Series();
                series5.setTitle("The Crown");
                series5.setDescription("Kraliçe Elizabeth II'nin saltanat dönemi ve İngiliz Kraliyet ailesinin hikayesi.");
                series5.setGenre("Tarih");
                series5.setReleaseYear(2016);
                series5.setPosterUrl("https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8VzZ2i.jpg");
                series5.setSeasonCount(6);
                series5.setEpisodeCount(60);
                repository.save(series5);

                Series series6 = new Series();
                series6.setTitle("Black Mirror");
                series6.setDescription("Teknolojinin karanlık yüzünü gösteren, her bölümü bağımsız distopik hikayeler.");
                series6.setGenre("Bilim Kurgu");
                series6.setReleaseYear(2011);
                series6.setPosterUrl("https://image.tmdb.org/t/p/w500/5UaYsGZOFhjFDwQh6GuLjjA1WlF.jpg");
                series6.setSeasonCount(6);
                series6.setEpisodeCount(27);
                repository.save(series6);

                Series series7 = new Series();
                series7.setTitle("The Mandalorian");
                series7.setDescription("Galaksinin uzak köşelerinde yaşayan yalnız bir silahşorun maceraları.");
                series7.setGenre("Bilim Kurgu");
                series7.setReleaseYear(2019);
                series7.setPosterUrl("https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg");
                series7.setSeasonCount(3);
                series7.setEpisodeCount(24);
                repository.save(series7);

                Series series8 = new Series();
                series8.setTitle("Chernobyl");
                series8.setDescription("1986 Çernobil nükleer felaketinin gerçek hikayesi ve kahramanların mücadelesi.");
                series8.setGenre("Tarih");
                series8.setReleaseYear(2019);
                series8.setPosterUrl("https://image.tmdb.org/t/p/w500/5VrL9j2IY0RGa7QUsOLBMJ0dLBD.jpg");
                series8.setSeasonCount(1);
                series8.setEpisodeCount(5);
                repository.save(series8);

                Series series9 = new Series();
                series9.setTitle("The Office (US)");
                series9.setDescription("Dunder Mifflin kağıt şirketinde çalışanların günlük yaşamları ve komik durumları.");
                series9.setGenre("Komedi");
                series9.setReleaseYear(2005);
                series9.setPosterUrl("https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg");
                series9.setSeasonCount(9);
                series9.setEpisodeCount(201);
                repository.save(series9);

                Series series10 = new Series();
                series10.setTitle("Friends");
                series10.setDescription("Altı arkadaşın New York'ta geçen günlük yaşamları, aşkları ve maceraları.");
                series10.setGenre("Komedi");
                series10.setReleaseYear(1994);
                series10.setPosterUrl("https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg");
                series10.setSeasonCount(10);
                series10.setEpisodeCount(236);
                repository.save(series10);
            }
        };
    }
}