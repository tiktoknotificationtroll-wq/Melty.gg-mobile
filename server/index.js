const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL;
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!BASE_URL || !STEAM_API_KEY || !SESSION_SECRET) {
  console.warn('Set BASE_URL, STEAM_API_KEY and SESSION_SECRET before enabling Steam login.');
}

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.APP_ORIGIN || true, credentials: true }));
app.use(session({
  secret: SESSION_SECRET || 'development-only-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 86400000 }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
if (BASE_URL && STEAM_API_KEY) {
  passport.use(new SteamStrategy({
    returnURL: BASE_URL.replace(/\/$/, '') + '/auth/steam/return',
    realm: BASE_URL.replace(/\/$/, '') + '/',
    apiKey: STEAM_API_KEY
  }, (identifier, profile, done) => {
    const steamId = profile.id || identifier.match(/id\/(\d+)$/)?.[1];
    done(null, { steamId, displayName: profile.displayName, avatar: profile.photos?.[2]?.value || profile.photos?.[0]?.value });
  }));
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'melty-mobile-api' }));
app.get('/auth/steam', passport.authenticate('steam'));
app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/?steam=failed' }), (req, res) => {
  res.redirect((process.env.APP_ORIGIN || 'melty://') + '?steam=connected');
});
app.get('/api/me', (req, res) => res.json({ user: req.user || null }));
app.get('/api/steam/games', async (req, res) => {
  if (!req.user?.steamId) return res.status(401).json({ error: 'Connect Steam first' });
  try {
    const url = new URL('https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/');
    url.searchParams.set('key', STEAM_API_KEY);
    url.searchParams.set('steamid', req.user.steamId);
    url.searchParams.set('include_appinfo', '1');
    url.searchParams.set('include_played_free_games', '1');
    const response = await fetch(url);
    if (!response.ok) return res.status(502).json({ error: 'Steam API request failed', status: response.status });
    const data = await response.json();
    res.json({ steamId: req.user.steamId, games: data.response?.games || [], game_count: data.response?.game_count || 0 });
  } catch (error) {
    res.status(502).json({ error: 'Could not retrieve Steam library' });
  }
});
app.post('/api/logout', (req, res) => req.logout(err => {
  if (err) return res.status(500).json({ error: 'Logout failed' });
  req.session.destroy(() => res.json({ ok: true }));
}));
app.listen(PORT, () => console.log('Melty API listening on ' + PORT));
