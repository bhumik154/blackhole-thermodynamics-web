"""
physics.py: Black Hole Thermodynamics Engine
All calculations based on General Relativity and Quantum Field Theory in curved spacetime.
Author: Bhumik Khatwani

Vendored verbatim from bhumik154/blackhole-thermodynamics
(commit d6d61e256c27dd679d14abd551e344e7e7027caa) as the reference
implementation for scripts/verify-parity.mjs. Do not edit - this file
exists only to prove the TypeScript port in src/lib/physics/ matches.
"""

import numpy as np
import math

# ── Physical Constants (SI units) ──
G     = 6.674e-11
c     = 2.998e8
hbar  = 1.055e-34
k_B   = 1.381e-23
sigma = 5.670e-8
M_sun = 1.989e30


def schwarzschild_radius(M_kg):
    return (2 * G * M_kg) / c**2

def hawking_temperature(M_kg):
    return (hbar * c**3) / (8 * np.pi * G * M_kg * k_B)

def bekenstein_hawking_entropy(M_kg):
    return (4 * np.pi * G * M_kg**2 * k_B) / (hbar * c)

def hawking_luminosity(M_kg):
    return (hbar * c**6) / (15360 * np.pi * G**2 * M_kg**2)

def evaporation_time(M_kg):
    return (5120 * np.pi * G**2 * M_kg**3) / (hbar * c**4)

def surface_gravity(M_kg):
    return c**4 / (4 * G * M_kg)


def get_all_properties(M_solar):
    M_kg = M_solar * M_sun
    rs = schwarzschild_radius(M_kg)
    t_evap_s = evaporation_time(M_kg)
    return {
        "mass_solar":       M_solar,
        "mass_kg":          M_kg,
        "rs_m":             rs,
        "rs_km":            rs / 1e3,
        "temp_K":           hawking_temperature(M_kg),
        "entropy_JK":       bekenstein_hawking_entropy(M_kg),
        "lum_W":            hawking_luminosity(M_kg),
        "surf_grav":        surface_gravity(M_kg),
        "evap_s":           t_evap_s,
        "evap_yr":          t_evap_s / 3.154e7,
    }


def scaling_curves(M_solar):
    log_c = math.log10(max(M_solar, 1e-20))
    lo = max(log_c - 4, -20)
    hi = min(log_c + 4, 12)
    masses = np.logspace(lo, hi, 120)
    masses_kg = masses * M_sun
    return {
        "masses_solar": masses,
        "rs_km":        np.array([schwarzschild_radius(m) / 1e3 for m in masses_kg]),
        "temp_K":       np.array([hawking_temperature(m) for m in masses_kg]),
        "entropy_JK":   np.array([bekenstein_hawking_entropy(m) for m in masses_kg]),
        "evap_yr":      np.array([evaporation_time(m) / 3.154e7 for m in masses_kg]),
    }
